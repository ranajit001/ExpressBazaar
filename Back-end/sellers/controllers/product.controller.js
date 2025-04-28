
import { ProductModel } from "../models/product.model.js";

import cloudinary from '../../configs/cloudinary.config.js'
import fs from 'fs';



export const getproduct_seller = async (req,res) => {
    const id = req.params.id;
    try {
        if(id){
           const prod =  await ProductModel.findById(id);
          return res.status(200).json(prod)
        };

        let searchobj = null;
        const search_keyword = req.query.search;
        searchobj ={
            $or:[
               { title:{$regex:search_keyword, $options: 'i'}},
               {brand:{$regex:search_keyword, $options: 'i'}},
               {description:{$regex:search_keyword, $options: 'i'}},
               {price:{$regex:search_keyword, $options: 'i'}},
               {keywords:{$regex:search_keyword, $options: 'i'}},
            ] ,     sellerId:req.user.id   //must have to add it thats why outsode or oper.
        };

        const sortObj ={}
            const{sort,order,page = 1,limit= 50} = req.query;
            if(sort) sortObj[sort] = order== 'dec' ? -1 : 1 
            const skip = (page - 1) * limit; //now skip is a number here


        const prods = await ProductModel.find(searchobj).sort(sortObj).skip(skip).limit(limit);
        res.status(200).json(prods)
    } catch (e) {
        res.status(500).json({message:'server error...'})
    }
};




export const newProduct_seller = async (req,res) => {
    try {
       const {title,brand,price,keywords,image} = req.body;
       if(!title || !price || !brand || !keywords || !image)
                    return res.status(400).json({message:'please provide all details...'})


        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image must be uploaded.' });
          }

              // Step 1: Upload all images to Cloudinary
    const imageUploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "Products" }) // optional folder
      );
  
      const uploadResults = await Promise.all(imageUploadPromises);
  
      // Step 2: Get all secure_urls
      const imageUrls = uploadResults.map((result) => result.secure_url);
  
      // Step 3: Clean up local uploads folder
      req.files.forEach((file) => fs.unlinkSync(file.path));

     // Step 4: Prepare final product data
     const productData = {
        title,
        brand,
        price,
        keywords,
        description,
        sellerName: req.user.name,
        sellerId: req.user.id,
        Image: imageUrls,   // <- Store array of URLs
      };
  
      // Step 5: Save to database
      const product = await ProductModel.create(productData);
  
      res.status(201).json(product);
  

    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

// seller_productRouter.post(
//     '/create',
//     upload.array('images', 5),  // for multiple images
//     newProduct_seller
//   );
  


export const updateProducts_seller = async (req, res) => {
         const id = req.params.id;
    try {

            if(id){
                await ProductModel.findByIdAndUpdate(id,req.body,{runValidators:true})
                return res.sendStatus(200)
            }


        const filter = { sellerId: req.user.id }; // Add sellerId for security

        // Loop through query params and dynamically build the filter
        for (let key in req.query) {
            if (req.query[key]) {
                filter[key] = { $regex: req.query[key], $options: 'i' }; // case-insensitive match
            }
        }
        // 2. Get the dynamic update data from the body
        const updateData = { ...req.body };  // All fields to be updated come from req.body

        // 3. If filter or updateData is empty, return error
        if (Object.keys(filter).length === 1 && !Object.keys(updateData).length) {
            return res.status(400).json({ message: "No fields to update" });
        }

        // 4. Perform update
        const result = await ProductModel.updateMany(
            filter, // dynamic filter
            updateData, // dynamic update data
            { runValidators: true }
        );

        // 5. Send response with result
        res.status(200).json({
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteProduct_seller = async (req, res) => {
    const id = req.params.id;
    try {
        if (id) {
            const deleted = await ProductModel.deleteOne({ sellerId: req.user.id, _id: id });
            if (deleted.deletedCount == 1) return res.sendStatus(200);
            else return res.sendStatus(404);
        }

        // No ID, delete many based on query (req.body)
        const filter = { sellerId: req.user.id };

        for (let key in req.body) {
            if (req.body[key]) {
                filter[key] = req.body[key];
            }
        }

        const deletedMany = await ProductModel.deleteMany(filter);
        if (deletedMany.deletedCount > 0) return res.sendStatus(200);
        else return res.sendStatus(404);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
