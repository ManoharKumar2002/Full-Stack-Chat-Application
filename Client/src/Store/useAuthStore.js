import {create} from "zustand" ;
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000/" : "/";

export const useAuthStore = create((set , get) => ({
    authUser : null ,
    isSigningUp : false ,
    isCheckingAuth : false ,
    isLoggingIn : false , 
    isUpdatingProfile : false , 
    socket : null ,
    onlineUsers : [],
    
    checkAuth : async () => {
        set({isCheckingAuth : true })
        try {
            const res = await axiosInstance.get("/auth/check");
            // setting the authUser 
            set({ authUser : res.data });
            get().connectSocket();

        } catch (error) {
            console.log("Error in checkAuth : " , error );
            set({ authUser : null });
        } finally {
            set({ isCheckingAuth : false });
        }
    },

    signup : async (data) =>{
        set({isSigningUp : true})
        try {
            // Creating the user 
            const user = await axiosInstance.post("/auth/register", data);
            if(user) toast.success("User registered Successfully !");
            else toast.error("User Not Created !");
            // setting the authenticated user 
            set({authUser : user.data});
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "error in signup ");
            console.log("Error in Signup : ", error );
        }finally{
            set({isSigningUp : false});
        }
    },

    login : async (data) =>{
        set({isLoggingIn : true})
        try {
            const res = await axiosInstance.post("/auth/login",data);
            if(res) toast.success("Login Successfully");
            set({authUser : res.data});
            get().connectSocket();
        }catch (error) {
            toast.error(error?.response?.data.message || "Network Error in login");
            console.log(error);
        }finally{
            set({isLoggingIn : false})
        }
    },

    logout : async () =>{
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({authUser : null});
            toast.success(res.data.message);
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "error in logout");
        }
    },

    updateProfile : async (data) => {
        set({isUpdatingProfile : true });
        try {
            // uploading the data 
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser : res.data});
            toast.success("Profile updated Successfully ");
        }catch (error) {
            toast.error(error.response.data.message || "error in upload Image ");
            console.log("Error in uploadImage  : ", error );
        } finally{
            set({isUpdatingProfile : false})
        }
    },

    connectSocket : async () =>{ 
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL , {
            query : {
                userId : authUser._id ,
            }
        }) 
        socket.connect();
        set({socket : socket})

        socket.on("getOnlineUsers" , (userIds) =>{
            set({onlineUsers : userIds})
        })
    },  

    disconnectSocket : () => {
        if(get().socket?.connected) get().socket.disconnect();
     },

}));