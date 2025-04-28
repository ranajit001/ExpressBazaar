import mongoose from "mongoose";

let connection = null;

export async function dbconnect(){
   try {
    if(!connection)
        connection = await mongoose.connect(process.env.mongourl)
    console.log('DB connected...');
    return connection
    
   } catch (error) {
    console.log('error in DB connect', error.message);
   }
}
