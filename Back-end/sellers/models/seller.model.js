import mongoose from "mongoose";



const sellerSchema = new mongoose.Schema({
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
        enum:['seller'],
        default:'seller'
    }
});

export const sellerModel = mongoose.model('selleruser',sellerSchema);
 