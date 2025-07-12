import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { updateProfile } from "./user.controller.js";
import { uploadCloudinary } from "../utils/cloudinary.utils.js";
import { io ,userSocketMap} from "../server.js";

const getUserForSidebar=async(req,res)=>{
    try {
        const userId=req.user._id;
        const filterdUser=await User.find({_id:{$ne:userId}}).select('-password');
        const unseenMessages={}
        const promises = filterdUser.map(async (user) => {
            const count = await Message.countDocuments({
                senderId: user._id,
                receiverId: userId,
                seen: false,
            });
            if (count > 0) {
                unseenMessages[user._id] = count;
            }
        });
        await Promise.all(promises);

        return res.json({
            success: true,
            users: filterdUser,
            unseenMessages,
            message: "Users fetched successfully",
        });
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

const getMessages=async(req,res)=>{
    try {
        const userId=req.user._id;
        const {id :selectedUserId}=req.params;
        const messages=await Message.find({$or:[{senderId:userId,receiverId:selectedUserId},{senderId:selectedUserId,receiverId:userId}]});
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: userId, seen: false },
            { $set: { seen: true } }
        );
        return res.json({success:true, messages, message:"Messages fetched successfully"}) 
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const markMessageAsSeen=async(req,res)=>{
    try {
        // const userId=req.user._id;
        const {id }=req.params;
        await Message.findById(id,{seen:true});
        return res.json({success:true, message:"Messages marked as seen successfully"}) 
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;
        let imageUrl;
        if (image) {
            const uploadRes = await uploadCloudinary(image);
            imageUrl = uploadRes.url;
        }
        const message=await Message.create({senderId,receiverId,text,image:imageUrl});
        const recieverSocketId=userSocketMap[receiverId];
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",message);
        }
        return res.json({success:true, message,message:"Message sent successfully"}) 
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

export {getUserForSidebar,getMessages,markMessageAsSeen,sendMessage}