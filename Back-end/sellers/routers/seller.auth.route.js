import { signup,login } from "../controllers/seller.auth.js";

import { Router } from "express";
export const sellerRouter = Router()

sellerRouter.post('/seller/signup',signup)
.post('/seller/login',login);
