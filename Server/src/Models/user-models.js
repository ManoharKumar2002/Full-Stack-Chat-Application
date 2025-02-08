import mongoose from "mongoose";



const userSchema = mongoose.Schema({
    fullname : {
        type : String , 
        required : true,
    },
    email : {
        type : String ,
        required : true ,
        unique : true   
    },
    password : {
        type : String ,
        required : true ,   
        minlength : 6 ,     
    },
    profilePic : {
        type : String ,
        default : "",  
}},  

    {    timestamps : true , }
)

const userModel = mongoose.model("users", userSchema);

export default userModel;


