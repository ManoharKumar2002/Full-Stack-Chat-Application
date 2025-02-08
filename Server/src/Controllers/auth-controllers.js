import cloudinary from "../Middlewares/cloudinary.js";
import { generateToken } from "../Middlewares/utils.js";
import userModel from "../Models/user-models.js";
import bcrypt from "bcrypt";

const registerController = async (req, res) => {
    try {
        const { fullname, email, password, profilePic } = req.body;
        if(!fullname || !email || !password) return res.status(400).send("all fields are required ");
        // check password 
        if(password.length < 6 ){
            return res.status(400).send({message : "Password should be greater than 6 "});
        }

        // check user 
        const checkUser = await userModel.findOne({ email });
        if (checkUser){
            return res.status(400).send({ message: "User already exits ", success: false });
        };

        // Encrypting user Password  
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password , saltRound);

        // Creating the user                    
        const newUser = await userModel.create({ fullname, email, profilePic, password : hashedPassword });

        if(newUser){
            // generating token 
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).send({
                message: "User created successfully",
                success: true,
                user: {
                    id: newUser._id,
                    fullname: newUser.fullname,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                }});
                

        }else{
            return res.status(400).send({message : "Invaild User details "});
        }
        
    } catch (error) {
        console.log("Error in signup controller",error.message);
        return res.status(500).send({ message: error.message, success: false });
    }
}

const loginController = async(req, res) => {
    try {
        const {password , email} = req.body;
        // Validations 
        if(!email || !password) return res.status(400).send({message:"All fields are required"}); 
        // Checking user 
        const user = await userModel.findOne({email});
        if(!user) return res.status(400).send({message : "Invalid Credential"});

        //checking password 
        const match = await bcrypt.compare(password , user.password);
        if(match){
            generateToken(user._id , res);
            return res.status(200).json({
                message : "Login Successfully !" ,
                id : user._id,
                fullname : user.fullname ,
                email : user.email , 
                profilePic : user.profilePic,
            });
        }else{
            return res.status(400).send({message : "Invalid Credential"});
        }

    } catch (error) {
        console.log("Error in Login Controller : " , error.message);
        return res.status(400).send({message : error.message});
    }
}


const logoutController = (req, res) => {
    try {
        res.cookie("jwt" , "" , {maxAge : 0});
        res.status(200).json({message : 'loggout Successfully'});
    } catch (error) {
        console.log("Error in Loggout Controller : " , error.message);
        return res.status(400).send({message : error.message});
    }
} 

const updateController = async (req , res )=>{
    try {
        const {profilePic} = req.body; 
        const userId = req.user.id;

        // checking profile pic 
        if(!profilePic){
            return res.status(400).send({message : "Profile pic required !"});
        }


        // Cloudinary upload image  
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        if ( !uploadResponse.secure_url) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
        }

        // updating user 
        const updatedUser = await userModel.findByIdAndUpdate(userId , {profilePic : uploadResponse.secure_url},{new : true});
        
        res.status(201).json(updatedUser);
        

    } catch (error) {
        console.error("Error in updateController:", error);
        res.status(500).json({ message: "An error occurred while updating the profile.", error });
    }
}

// const updateController = async (req, res) => {
//     try {
//         const { profilePic } = req.body;
//         const userId = req.user?.id || req.user?._id; // Adjust based on middleware

//         // Validate profilePic
//         if (!profilePic) {
//             return res.status(400).json({ message: "Profile picture is required!" });
//         }

//         // Upload image to Cloudinary
//         const uploadResponse = await cloudinary.uploader.upload(profilePic);

//         if (!uploadResponse || !uploadResponse.secure_url) {
//             return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
//         }

//         // Update user in database
//         const updatedUser = await userModel.findByIdAndUpdate(
//             userId,
//             { profilePic: uploadResponse.secure_url },
//             { new: true } // Return the updated document
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found!" });
//         }

//         // Respond with updated user
//         res.status(200).json(updatedUser);

//     } catch (error) {
//         console.error("Error in updateController:", error);
//         res.status(500).json({ message: "An error occurred while updating the profile.", error });
//     }
// };


const checkController = (req , res)=>{
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send({message : "Internal Server Error "});
        console.log("Error in checkController : " , error.message);
    }
}
export default {loginController , registerController , logoutController , updateController , checkController};
