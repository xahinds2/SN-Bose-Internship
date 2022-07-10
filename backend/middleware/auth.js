const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthUser = catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    
    if (!token){
        return next(new ErrorHander("please log in to view",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
})

exports.authorizeRoles = (...roles) => {
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
            return next(
            new ErrorHander(`Role : ${req.user.role} is not allowed to access this resource`,403)
            )
        }
        next();
    }
}