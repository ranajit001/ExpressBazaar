import express from "express";

import { sellerRouter } from "./sellers/routers/product.router.js";
import { buyeRouter } from "./buyers/routes/buyer.auth.route.js";
import { dbconnect } from "./configs/mongodb.config.js";
import { config } from "dotenv";
config()


const app = express()

app.use(express.Router)


app.use('/',buyeRouter)
app.use('/seller',sellerRouter)


app.listen(+process.env.PORT,async()=>{
    await dbconnect()
    console.log('server started...');
    
})
