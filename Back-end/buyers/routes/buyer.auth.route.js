import { signup,login } from "../controllers/buyer.auth.js";
import { Router } from "express";
export const  buyeRouter = Router()

buyeRouter
.post('/signup',signup)
.post('/login',login)




import { roleBased } from "../middlewares/auth.middleware.js";
import { getAllProducts,addtoCart,removefromCart } from "../controllers/searchProduct.controller.js";

buyeRouter
.get(['/allProducts', '/allProducts/:id'],getAllProducts)
.post('/addToCart/:id',roleBased(['buyer']),addtoCart)
.patch('/removeFromCart/:id',roleBased(['buyer']),removefromCart)

