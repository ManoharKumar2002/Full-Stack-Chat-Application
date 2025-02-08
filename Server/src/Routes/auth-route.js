import express from "express";
import { protectRoute } from "../Middlewares/auth-middleware.js";
import Controllers from "../Controllers/auth-controllers.js";
const { loginController ,registerController ,logoutController , updateController , checkController } = Controllers ;

// making route 
const route = express.Router();

// register 
route.post('/register' , registerController);
route.post('/login' , loginController);
route.post('/logout' , logoutController);
route.put("/update-profile", protectRoute , updateController);
route.get("/check", protectRoute , checkController);

export default route ; 