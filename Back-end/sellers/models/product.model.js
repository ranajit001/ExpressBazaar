import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "selleruser" },
  category:{type:String},
  description:{type:String},
  sellerName:{type:String,require:true,trim:true},
  title: { type: String, required: true,trim:true },
  brand:{type:String,require:true,trim:true},
  image:[{type:String}],
  price: { type: Number, required: true },
  // stock: { type: Number, required: true },
  keywords:{type:String}
},{
    timestamps: true,
    strict: true
});

export const ProductModel = mongoose.model("Product", productSchema);
