import { sellerModel } from '../models/seller.model.js';
import argon2 from 'argon2'
import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
configDotenv();

const generateToken = (user) => 
    jwt.sign(
      { id: user._id, role: user.role, email: user.email,   name:user.name },
      process.env.jwt,
      { algorithm: 'RS256', expiresIn: '15d' }
    );
  


export const signup = async (req,res) => {
   try {
    const {email,password}= req.body
    const user = await sellerModel.findOne({email})
    if(user) return res.status(409).json({message:'user already exists...'})
        const hash = argon2.hash(password)

   await sellerModel.create({...req.body,password:hash})
    res.sendStatus(201)
   } catch (error) {
    res.status(500).json({message:'server error while signup...'})
    console.log(error);
    
   } 
};

export const login = async (req,res) => {
    try {
        const {email,password}= req.body;
        const user = await sellerModel.findOne({email});
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