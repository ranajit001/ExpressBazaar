import {
     getproduct_seller,
     newProduct_seller,
     updateProducts_seller,
     deleteProduct_seller } from "../controllers/product.controller.js";

import { Router } from "express";
import { seller_roleBased } from "../middlewares/auth.middleware.js";
export const seller_productRouter = Router()

seller_productRouter
.use(seller_roleBased(['seller']))

.post('/create',newProduct_seller)
.get(['/','/:id'],getproduct_seller)
.patch(['/update','/update/:id'],updateProducts_seller)
.delete(['/delete/:id','/delete'],deleteProduct_seller)

