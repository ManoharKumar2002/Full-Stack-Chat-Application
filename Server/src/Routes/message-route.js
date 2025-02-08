import exprss from "express";
import { getMessages, getUsersForSidebar, sendMessage } from "../Controllers/message-controllers.js";
import { protectRoute } from "../Middlewares/auth-middleware.js";
import route from "./auth-route.js";
const router = exprss.Router();


router.get("/", protectRoute , (req , res) =>{
    res.status(200).send("Welcome to Message Route");
})

// Get the users for side bar 
router.get("/users" , protectRoute , getUsersForSidebar);

// Get the Messages for user 
router.get("/:id" , protectRoute , getMessages);

// Send the message 
router.post("/send/:id" , protectRoute , sendMessage);

export default router ;