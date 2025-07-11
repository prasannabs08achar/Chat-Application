import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async(req, res, next) => {
    try {
        const token=req.headers.token
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken.userId).select('-password')
        if(!user) {
            return res.status(401).json({success:false, message:"User not found"})
        }
        req.user=user
        next()
    } catch (error) {
        return res.status(401).json({success:false, message:"Invalid token"})
    }
}