import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "buyeruser" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: { type: Number, required: true,default:1 },
    },
  ],
});

export const cartModel = mongoose.model("cart", cartSchema);
