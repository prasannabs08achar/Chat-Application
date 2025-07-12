import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { uploadCloudinary } from "../utils/cloudinary.utils.js";

const generateToken=(userId)=>{
    const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    return token;
}
const signup=async (req,res) => {
    try {
        const {fullName,email,password,bio}=req.body;
        if(!fullName || !email || !password || !bio) 
            return res.json({success:false, message:"All fields are required"});
        const user=await User.findOne({email});
        if(user)
            return res.json({success:false, message:"User already exists"});
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({fullName,email,password:hashedPassword,bio});
        const token=generateToken(newUser._id);
        await newUser.save();
        return res.status(201).json({success:true, userData:newUser,token, message:"User created successfully"})

    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}


const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password) 
            return res.json({success:false, message:"All fields are required"});
        const user=await User.findOne({email});
        if(!user)
            return res.json({success:false, message:"User does not exist"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.json({success:false, message:"Invalid credentials"});
        const token=generateToken(user._id);
        return res.json({success:true, userData:user,token, message:"User logged in successfully"})
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

const checkAuth=(req,res)=>{
    try {
        return res.json({success:true,user:req.user, message:"User is authenticated"})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

const updateProfile=async(req,res)=>{
    try {
        const {profilePic,bio,fullName}=req.body;
        const userId=req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
        }else{
            const profilePicCloudinary=uploadCloudinary(profilePic);
            updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName,profilePic:profilePicCloudinary.url},{new:true}); 
        }
        return res.json({success:true, user:updatedUser, message:"User profile updated successfully"})
        
    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }

}

export {signup,login,checkAuth,updateProfile}