import { buyerModel } from "../models/buyer.model.js";
import argon2 from 'argon2'
import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
configDotenv();

const generateToken = (user) => 
    jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.jwt,
      {  expiresIn: '15d' }
    );
  


export const signup = async (req,res) => {
   try {
    const {name,email,password}= req.body; console.log('buyer signing in');
    
    if(!name || !email || !password) return res.status(400).json({message:'All fields are required...'})
    const user = await buyerModel.findOne({email})
    if(user) return res.status(409).json({message:'user already exists...'})
        const hash = await argon2.hash(password)

   await buyerModel.create({...req.body,password:hash})
    res.status(200).json({message:'created'})
   } catch (error) {
    res.status(500).json({message:'server error while signup...'})
    console.log(error);
    
   } 
};

export const login = async (req,res) => {
    try {
        const {email,password}= req.body; console.log('buyer logging in');
        
            if( !email || !password) return res.status(400).json({message:'All fields are required...'})
        const user = await buyerModel.findOne({email});
        if(!user) return res.status(404).json({message:'user not exists... please signup...'})

            const verified = argon2.verify(user.password,password)
            if(!verified) return res.status(401).json({message:'invalid password...'})

    res.status(200).json({
        name:user.name,
        email:user.email,
        role:user.role,
        token:generateToken(user)
    });
    } catch (error) {
        res.status(500).json({message:'server error from login user'});
        console.log(error.message);
        
    }
};