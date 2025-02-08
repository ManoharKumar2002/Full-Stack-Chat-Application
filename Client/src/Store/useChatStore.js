import {create} from "zustand";
import {toast} from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set , get) => ({
    messages : [] ,
    users : [] ,
    selectedUser : null , 
    isMessagesLoading : false , 
    isUsersLoading : false ,

    getUsers : async ()=>{
        set({isUsersLoading : true });
        try {
            // getting users from backend 
            const userRes = await axiosInstance.get("/messages/users");
            if(!userRes){
                return toast.error("User not found");
            }
            set({users : userRes.data});
        } catch (error) {
            toast.error(error.response.data.message || "Can't loaded Users ");
        }finally{
            set({isUsersLoading : false});
        }
    },

    getMessages : async (userId) => {
        set({isMessagesLoading : true});
        // gettting messages 
        try {
            const messagesRes = await axiosInstance.get(`/messages/${userId}`);
            set({messages : messagesRes.data});
            
        }catch (error) {
            toast.error(error?.response?.data?.message || "Can't loaded Messages ");
        }finally{
            set({isMessagesLoading : false})
        }
    },

    sendMessages : async (messageData) =>{
       const {selectedUser , messages} = get();
       try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        if(!res) return toast.error("Response not getting !")
        set({messages : [...messages,res.data]})
       } catch (error) {
            toast.error(error?.response?.data?.message || "error in sending messages");
            console.log(error);
       }     
    },


    subscribeToMessages : () =>{
        try {
        const {selectedUser} = get();
        if(!selectedUser) return ;

        const socket = useAuthStore.getState().socket ; 

         socket.on("newMessage" , (newMessage) =>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id ;
            if(!isMessageSentFromSelectedUser) return ;
           set({
            messages : [...get().messages, newMessage],
           })
         })
        } catch (error) {
            console.log(error);
        }
        
    },

    unsubscribeFromMessages : () => {
        const socket = useAuthStore.getState().socket ; 
        socket.off('newMessage');             
    },

    setSelectedUser : async (selectedUser) =>  set({selectedUser}),
       
    
}));