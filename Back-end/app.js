import express from "express";
import cors from 'cors';

import { sellerRouter } from "./sellers/routers/product.router.js";
import { buyeRouter } from "./buyers/routes/buyer.auth.route.js";
import { dbconnect } from "./configs/mongodb.config.js";
import { config } from "dotenv";
config()


const app = express()

app.use(express.json())
app.use(cors())

app.use('/',buyeRouter)
app.use('/seller',sellerRouter)

app.get('/',(req,res)=> res.send('ok'))
app.use((req,res)=> res.status(500).json({message:'this is not a correct route'}))

app.listen(+process.env.PORT,async()=>{
    await dbconnect()
    console.log('server started...');
    
})
