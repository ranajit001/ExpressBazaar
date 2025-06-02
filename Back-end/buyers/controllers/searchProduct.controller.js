import { ProductModel } from "../../sellers/models/product.model.js";
import { cartModel } from "../models/cart.model.js";


export const getAllProducts = async (req, res) => {  
  const id = req.params.id;

  try {
    // 0. Return single product by ID
    if (id) {
      const product = await ProductModel.findById(id);
      if (product) return res.status(200).json(product);
    }

    let aggregationPipeline = [];
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

    // 1. Search keyword
    if (search_keyword.length>0) {
      const searchFilter = {
        $or: [
          { title: { $regex: search_keyword, $options: 'i' } },
          { description: { $regex: search_keyword, $options: 'i' } },
          { tags: { $elemMatch: { $regex: search_keyword, $options: 'i' } } },
          { brand: search_keyword },
          { category: search_keyword },
        ]
      };
      aggregationPipeline.push({ $match: searchFilter });
    }

    // 2. Brand/Category filters
    const andConditions = [];

    if (brands) {
      let brandList = []
      brandList = brands.split(','); 
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

    // 4. Rating filter (expects ratings as comma-separated values)
    if (rating) {
      aggregationPipeline.push({ $match: { rating: { $gte: +rating.trim() } } });
    }

    // ✅ Save pre-pagination pipeline for brand/category filter counts
    const baseFilterPipeline = [...aggregationPipeline];

    // 5. Sorting
    const sortOption = order === 'asc' ? 1 : -1;
    aggregationPipeline.push({ $sort: { [sort]: sortOption } });

    // 6. Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: parseInt(limit +1) });

    // 7. Fetch final filtered products
    const products = await ProductModel.aggregate(aggregationPipeline);
    const hasMoreItems =products.length == limit +1 ? true:false;  // to checkme idf thre is more product pagination or not 
    if(hasMoreItems)products.pop(); //to maintain limit;

    // 8. Fetch available brands/categories in current filtered set
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
      products,
      brands: brandsData.map(b => b.brand),
      categories: categoriesData.map(c => c.category),
      hasMoreItems
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};



 export  const addtoCart = async (req, res) => {
    try {
      const productId = req.params.id;
      const buyerId = req.user.id;
      if (!productId) return res.status(400).json({message:'no product selected...'});
  
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
  