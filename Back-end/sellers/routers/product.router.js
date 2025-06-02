import { signup,login } from "../controllers/seller.auth.js";
import { Router } from "express";

export const sellerRouter = Router()


sellerRouter
.post('/signup',signup)
.post('/login',login);





import {
     getproduct_seller,
     newProduct_seller,
     updateProducts_seller,
     deleteProduct_seller } from "../controllers/product.controller.js";


import { seller_roleBased } from "../middlewares/auth.middleware.js";
import {upload} from '../middlewares/multer.middleware.js'


sellerRouter
.use(seller_roleBased(['seller']))

.post('/create',upload.array('images', 5),newProduct_seller)
.get(['/products','/products/:id'],getproduct_seller)
.patch(['/update','/update/:id'],updateProducts_seller)
.delete(['/delete/:id','/delete'],deleteProduct_seller)







