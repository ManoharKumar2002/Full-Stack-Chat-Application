import jwt from "jsonwebtoken";
import userModel from "../Models/user-models.js";

export const protectRoute = async (req , res , next) =>{
    try {
        const token = req.cookies.jwt ; 
        
        
        if(!token) return res.status(400).send({message : "Unauthorized Access !"});
        // Decoding Password 
        const decode =  jwt.verify(token , process.env.JWT_KEY);
        if(!decode) return res.status(401).send({message : "Unauthorized - Invalid Token"});

        // checking password 
        const user = await userModel.findById(decode.userId).select("-password");
        if(!user) return res.status(400).send({message : "user not found "});

        req.user = user ; 
        next();
    } catch (error) {
        console.log(`Error in protectRoute ${error.message}`);
        return res.status(500).send({message : "Internal Server Error "});
    }
}