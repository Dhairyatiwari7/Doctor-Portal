import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from 'validator'

const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:"Invalid email"
            })
        }
        if(password.length<8){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 8 characters long"
            })  
        }
        const userExists=await User.findOne({email})
        if(userExists){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const user=new User({
            name,
            email,
            password:hashedPassword
        })
        await user.save()
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"24h"})
        res.status(200).json({
            success:true,
            message:"User registered successfully",
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export {registerUser}