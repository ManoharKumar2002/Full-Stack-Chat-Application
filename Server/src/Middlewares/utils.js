import jwt from "jsonwebtoken";

export const generateToken = (userId , res) =>{
    const token = jwt.sign({userId} , process.env.JWT_KEY , {
        expiresIn : "7d"
    })

    res.cookie("jwt" , token ,{
        maxAge : 7 * 24 * 60 * 60 * 1000 , // ms
        httpOnly : true , // prevent XSS attacks cross-site scripting attacks 
        samesite : "script" , // CSRF cross-site request forgery attacks 
        secure : process.env.NODE_ENV !== "development" // if not development then true  
    });

    return token ;
}