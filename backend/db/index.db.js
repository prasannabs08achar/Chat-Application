import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb=async()=>{
    try {
        const connectedInstance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`Connected to DB ${connectedInstance.connection.db.databaseName}`);
        
    } catch (error) {
        console.error("Error",error);
        
    }
}

export default connectDb;