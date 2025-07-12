 import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
 export const ChatContext=createContext();

 export const ChatProvider=({children})=>{

    const [messages,setMessages]=useState([]);
    const [users,setUsers]=useState([]);
    const [selectedUser,setSelectedUser]=useState(null);
    const [unseenMessages,setUnseenMessages]=useState({})
    const {socket,axios}=useContext(AuthContext)
    //  axios.defaults.baseURL = backendUrl

    const getUsers=async()=>{
        try {
            const {data}=await axios.get('/api/messages/users');
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const getMessages=async(userId)=>{
        try {
            const {data}=await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const sendMessage=async(messageData)=>{
        try {
            const {data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prevMessages)=>{
                    return [...prevMessages,data.message]
                })
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    const subscribeToMessages=async()=>{
        if(!socket){
            return;
        }
        socket.on("newMessage",(message)=>{
           if(selectedUser&& message.senderId===selectedUser._id){
               message.seen(true);
               setMessages((prevMessages)=>[...prevMessages,message])
               axios.put(`/api/messages/mark/${message._id}`,);

           }else{
            setUnseenMessages((prevUnseenMessages)=>({
                ...prevUnseenMessages, [message.senderId]:prevUnseenMessages[message.senderId]?prevUnseenMessages[message.senderId]+1:1
            }))
           }
        })
    }

    const unsubscribeToMessages=async()=>{
        if(socket){
            socket.off("newMessage");
        }
        
    }
    useEffect(()=>{
        subscribeToMessages();
        return ()=>{
            unsubscribeToMessages();
        }
    },[socket,selectedUser])
    const value={
        users,
        selectedUser,
        setSelectedUser,
        messages,
        sendMessage,
        getMessages,
        unseenMessages,
        getUsers,
        setMessages,
        setUnseenMessages
    }
     return <ChatContext.Provider value={value}>
        {children}
     </ChatContext.Provider>
 }