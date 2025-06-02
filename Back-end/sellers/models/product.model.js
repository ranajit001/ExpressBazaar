import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "selleruser", required: true },
  sellerName: { type: String, required: true, trim: true },

  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true, trim: true },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  tags: [{ type: String, required: true }],
  rating: { type: Number}, // Added
  stock:{type:Number,required:true,default:0}
});

export const ProductModel = mongoose.model("Product", productSchema);
