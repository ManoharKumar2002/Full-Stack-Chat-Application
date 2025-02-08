import { get } from "mongoose";
import cloudinary from "../Middlewares/cloudinary.js";
import { getReceiverSocketId, io } from "../Middlewares/socket.js";
import messageModel from "../Models/message-models.js"; 
import userModel from "../Models/user-models.js";

export const getUsersForSidebar = async (req , res) =>{
    try {
        const loggedInUserId = req.user._id ; 
        // getting user for sidebar 
        const filleredUsers = await userModel.find({_id : {$ne : loggedInUserId}}).select("-password");

        return res.status(200).json(filleredUsers);
    } catch (error) {
        console.log(`Error in getUserForSidebar : ${error.message}`);
        res.status(500).send("Internal Server Error ");
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        if (!userToChatId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // Sorting in ascending order

        return res.status(200).json(messages);
    } catch (error) {
        console.error(`Error in getMessages: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




export const sendMessage = async (req , res ) => {
    try {
        const {text , image } = req.body; 
        const {id : receiverId } = req.params ;
        const senderId = req.user._id ;

        if(!text || !receiverId || !senderId ){
            return res.status(400).send("All fields are require");
        }
        let imageUrl ; 
        // checking image 
        if(image){
            // upload base64 image to cloudinary 
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url ; 
        }

        // sending the message 
        const newMessage = new messageModel({
            senderId , 
            receiverId , 
            text , 
            image : imageUrl ,
        });

        await newMessage.save();

        // real time functionality 
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" , newMessage);
        }
        return res.status(201).json(newMessage); 
    } catch (error) {
        console.log(`Error in sendMessage : ${error?.message}`);
        res.status(500).send("Internal Server Error");
    }
};