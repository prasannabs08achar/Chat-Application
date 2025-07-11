import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import connectDb from './db/index.db.js'
import userRouter from './routes/user.routes.js'
import messageRouter from './routes/message.routes.js'
import { Server } from 'socket.io'
import { log } from 'console'

const app=express()
const server=http.createServer(app)

//Initialize socket server
export const io= new Server(server,{cors:{origin:"*"}})

//Store online user
export const userSocketMap={}; //{userId:socketId}

//Socket.io connection
io.on("connection",socket=>{
    const userId=socket.handshake.query.userId;
    console.log("user connected",userId);
    if(userId)
    userSocketMap[userId]=socket.id

    //Emit online users to all connected client
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    socket.on("disconnect",()=>{
        console.log("user disconnected",userId);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
        
    })
})

app.use(cors())
app.use(express.json({limit:"4mb"}))

app.use("/api/status",(req,res)=>res.send("Server is running"));

await connectDb()



app.use('/api/auth',userRouter)
app.use('/api/messages',messageRouter)
const PORT=process.env.PORT || 5000
server.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))