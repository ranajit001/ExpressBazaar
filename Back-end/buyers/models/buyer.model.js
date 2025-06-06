import mongoose from "mongoose";



const buyerSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
    },email:{
        type:String,
        require:true,
        trim:true,
        unique:true,
    },password:{
        type:String,
        require:true,
        trim:true,
    },role:{
        type:String,
        require:true,
        enum:['buyer'],
        default:'buyer'
    }
});

export const buyerModel = mongoose.model('buyeruser',buyerSchema);
 