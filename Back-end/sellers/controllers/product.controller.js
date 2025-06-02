import { ProductModel } from "../models/product.model.js";

import cloudinary from '../../configs/cloudinary.config.js'
import fs from 'fs';



export const getproduct_seller = async (req, res) => {
  const id = req.params.id;
  
  // Add debugging
  // console.log('User in request:', req.user);
  // console.log('Seller ID:', req.user?.id);

  try {
    // 0. Return single product by ID
    if (id) {
      const product = await ProductModel.findById(id);
      if (product) return res.status(200).json(product);
    }

    let aggregationPipeline = [];

    // Modified seller matching to handle potential undefined sellerId
    if (!req.user?.id) {
      return res.status(400).json({ message: 'Seller ID not found in request' });
    }

    // Convert string ID to ObjectId if needed
    // aggregationPipeline.push({ 
    //   $match: { 
    //     sellerId: req.user.id.toString() 
    //   } 
    // });

    const {
      search: search_keyword,
      brands,
      categories,
      minPrice,
      maxPrice,
      rating,
      sort = 'price',
      order = 'asc',
      page = 1,
      limit = 25,
    } = req.query;

    // 1. Search keyword (optional)
    if (search_keyword && search_keyword.length > 0) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { title: { $regex: search_keyword, $options: 'i' } },
            { description: { $regex: search_keyword, $options: 'i' } },
            { tags: { $elemMatch: { $regex: search_keyword, $options: 'i' } } },
            { brand: search_keyword },
            { category: search_keyword },
          ]
        }
      });
    }

    // 2. Brand/Category filters
    const andConditions = [];

    if (brands) {
      const brandList = brands.split(',');
      andConditions.push({ brand: { $in: brandList } });
    }

    if (categories) {
      const categoryList = categories.split(',');
      andConditions.push({ category: { $in: categoryList } });
    }

    if (andConditions.length > 0) {
      aggregationPipeline.push({ $match: { $and: andConditions } });
    }

    // 3. Price filter
    if (minPrice || maxPrice) {
      const priceFilter = {
        price: {
          ...(minPrice && { $gte: parseFloat(minPrice) }),
          ...(maxPrice && { $lte: parseFloat(maxPrice) }),
        }
      };
      aggregationPipeline.push({ $match: priceFilter });
    }

    // 4. Rating filter
    if (rating) {
      aggregationPipeline.push({ $match: { rating: { $gte: +rating.trim() } } });
    }

    // ✅ Save base filter for brand/category aggregation
    const baseFilterPipeline = [...aggregationPipeline];

    // 5. Sorting
    const sortOption = order === 'asc' ? 1 : -1;
    aggregationPipeline.push({ $sort: { [sort]: sortOption } });

    // 6. Pagination
    // const skip = (parseInt(page) - 1) * parseInt(limit);
    // aggregationPipeline.push({ $skip: skip });
    // aggregationPipeline.push({ $limit: parseInt(limit) + 1 }); // +1 to check if more exists

    // 7. Fetch filtered products
    const products = await ProductModel.aggregate(aggregationPipeline);

    const hasMoreItems = products.length === parseInt(limit) + 1;
    if (hasMoreItems) products.pop(); // maintain the exact limit

    // 8. Fetch available brands/categories in filtered set
    const brandsData = await ProductModel.aggregate([
      ...baseFilterPipeline,
      { $group: { _id: '$brand' } },
      { $project: { brand: '$_id', _id: 0 } }
    ]);

    const categoriesData = await ProductModel.aggregate([
      ...baseFilterPipeline,
      { $group: { _id: '$category' } },
      { $project: { category: '$_id', _id: 0 } }
    ]);

    // 9. Send response
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      products:products.filter(e=>e.sellerId == req.user.id),
      brands: brandsData.map(b => b.brand),
      categories: categoriesData.map(c => c.category),
      hasMoreItems
    });

  } catch (error) {
    console.error(error, 'seller get prod');
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};





export const newProduct_seller = async (req,res) => { 

    try {
const { title, brand, price, tags, category, description,stock } = req.body;
       if(!title || !price || !brand || tags.length==0  || !category)
                    return res.status(400).json({message:'please provide all details...'})


        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image must be uploaded.' });
          }

              // Step 1: Upload all images to Cloudinary
    const imageUploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "Products" }) // optional folder
      );
  console.log(imageUploadPromises);
  
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
        category,
        tags,
        description,
        sellerName: req.user.name,
        sellerId: req.user.id,
        images: imageUrls,   // <- Store array of URLs
        stock
      };
      console.log(productData);
      
      // Step 5: Save to database
      const product = await ProductModel.create(productData); 
      
  
      res.status(201).json(product);
  

    } catch (error) { console.log(error);
    
        res.status(500).json({message:error.message})
    }
};

// seller_productRouter.post(
//     '/create',
//     upload.array('images', 5),  // for multiple images
//     newProduct_seller
//   );
  

// data to select prodct will come through query and what need to update will code through body.
export const updateProducts_seller = async (req, res) => {
         const id = req.params.id;
    try {console.log(req.body);
    

            if(id){
                const prod = await ProductModel.findByIdAndUpdate(id,req.body,{runValidators:true,new:true})
                return res.status(200).json(prod)
            }


        const filter = { sellerId: req.user.id }; // Add sellerId for security

        // Loop through query params and dynamically build the filter
        for (let key in req.query) {
            if (req.query[key]) { // if value is not null or empty
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
        console.log(error);
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

    for (let key in req.query) {
        if (req.query[key]) filter[key] = req.query[key];
        }


        const deletedMany = await ProductModel.deleteMany(filter);
        if (deletedMany.deletedCount > 0) return res.sendStatus(200);
        else return res.sendStatus(404);

    } catch (error) { console.log(error);
    
        res.status(500).json({ message: error.message });
    }
};
