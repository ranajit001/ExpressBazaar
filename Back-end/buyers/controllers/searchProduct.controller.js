import { ProductModel } from "../../sellers/models/product.model.js";
import { cartModel } from "../models/cart.model.js";

export const getAllProducts = async (req, res) => {

    //search by id
    const id = req.params.id;
    try {

        if(id){
            const product = await ProductModel.findById(id)
            if(product) return res.status(200).json(product)
        }
      // 1. Search Filter
      let searchFilter = {};
  
      if (req.query.search) {
        const keyword = req.query.search;
        searchFilter = {
          $or:[
            { title:{$regex:search_keyword, $options: 'i'}},
            {brand:{$regex:search_keyword, $options: 'i'}},
            {description:{$regex:search_keyword, $options: 'i'}},
            {price:{$regex:search_keyword, $options: 'i'}},
            {keywords:{$regex:search_keyword, $options: 'i'}},
         ]
        };
      }
  

      const {page = '1',limit = '50',sort = 'price',order = 'asc'} = req.query;

      // 2. Sort Option
      let sortOption = {[sort]:order== 'asc'? 1:-1};

      // 3. Pagination
      const skip = (page - 1) * limit; //now skip is a number here
  
      // 4. Fetch products
      const products = await ProductModel.find(searchFilter)
        .sort(sortOption)
        .skip(+skip)
        .limit(+limit);
  
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            products
          });
          
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products", error: error.message });
      console.log(error);
      
    }
  };
  



 export  const addtoCart = async (req, res) => {
    try {
      const productId = req.params.id;
      const buyerId = req.user.id;
      if (!productId) return res.sendStatus(400);
  
      let cart = await cartModel.findOne({ buyerId });
  
      if (!cart) {
        // No cart exists, create new
        cart = new cartModel({
          buyerId,
          products: [{ product: productId, quantity: 1 }]
        });
      } else {
        // Cart exists
        const productInCart = cart.products.find(
          (item) => item.product.toString() === productId
        );
  
        if (productInCart) {
          productInCart.quantity += 1; // increase quantity
        } else {
          cart.products.push({ product: productId, quantity: 1 }); // add new product
        }
      }
  
      await cart.save(); // Save all changes
      res.status(200).json({ message: "Cart updated", cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  




 export  const removefromCart = async (req, res) => {
    try {
      const productId = req.params.id;
      if (!productId) return res.sendStatus(400);
  
      const cart = await cartModel.findOne({ buyerId: req.user.id });
  
      if (!cart) return res.sendStatus(404); // cart not found
  
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
  
      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      if (cart.products[productIndex].quantity > 1) {
        // If quantity > 1, reduce quantity by 1
        cart.products[productIndex].quantity -= 1;
      } else {
        // If quantity == 1, remove the product
        cart.products.splice(productIndex, 1);
      }
  
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  