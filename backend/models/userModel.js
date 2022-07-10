const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userScema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , "Please Enter Your Name"],
        maxLength : [30, "Name cannot exceed 30 characters"],
        minLength: [4,"Nmae should not have more than 30 characters"] 
    },
    email : {
        type : String ,
        required : [true,"Please Enter Your Email"],
        unique : true,
        validate : [validator.isEmail,"Please Enter A Valid Email" ] 
    },
    password :{
        type : String,
        required : [true, "Please Enter Your Password"],
        minlength : [8,"Password Should Be greater than 8 characters"],
        select : false
    },
    avatar : {
        public_id : {
            type : String,
            required : true
        },
        url : {
            type : String ,
            required : true
        }

    },
    role : {
        type : String,
        default : "user"
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,

});

userScema.pre("save", async function(next){

    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(this.password,salt)
        this.password=hash;
    }
    next();
})

//JWT TOKEN

userScema.methods.getJWTToken = function (){
    return jwt.sign({id : this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}   


//Compare Password
userScema.methods.comparePassword = async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)
}

//genrating password reset token

userScema.methods.getResetPasswordToken = function(){

    //Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    //hashing and adding ResetPasswordToken to userschema

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() +  15*60*1000;

    return resetToken;

}

module.exports = mongoose.model("User",userScema);