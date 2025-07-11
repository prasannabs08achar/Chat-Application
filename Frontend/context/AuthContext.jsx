import { createContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client"
export const AuthContext = createContext();
// const backendUrl=import.meta.env.VITE_BACKEND_URL
const backendUrl = 'http://localhost:5000'
axios.defaults.baseURL=backendUrl

export const AuthProvider = ({ children })=>{

    const [token,setToken]=useState(localStorage.getItem('token'));
    const [authUser,setAuthUser]=useState(null);
    const [onlineUsers,setOnlineUsers]=useState([]);
    const [socket,setSocket]=useState(null);

    const checkAuth=async()=>{
        try {
            const token = localStorage.getItem("token"); // make sure token is stored after login
            if (!token) {
                throw new Error("Token not found");
            }
            const { data } = await axios.get('/api/auth/checkAuth');
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    
    }
    const login=async(state,credentials)=>{
        try {
           const {data}=await axios.post(`/api/auth/${state}`,credentials); 
           if(data.success){
               setAuthUser(data.userData)
               connectSocket(data.userData)
               axios.defaults.headers.common['token'] = data.token;
               setToken(data.token);
               localStorage.setItem('token',data.token);
               toast.success(data.message);
           }else{
               toast.error(data.message);
           }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout=async()=>{
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common['token'] = null;
        toast.success('Logged out successfully');
        socket?.disconnect();
    }

    const updateProfile=async(body)=>{
        try {
            const {data}=await axios.put('/api/auth/profile',body);
            if(data.success){
                setAuthUser(data.user);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const connectSocket=(userData)=>{
            if(!userData ||socket?.connected) return;
            const newSocket=io(backendUrl,{query:{userId:userData._id}});
            newSocket.connect();
            setSocket(newSocket);
            newSocket.on('getOnlineUsers',(userIds)=>{
                setOnlineUsers(userIds)
            })
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth()
    },[])
    const value={
        axios,
        // token,
        // setToken,
        authUser,
        // setAuthUser,
        onlineUsers,
        // setOnlineUsers,
        socket,
        // setSocket,
        login,
        logout,
        updateProfile
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}