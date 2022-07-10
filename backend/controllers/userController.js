const ErrorHander = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")

//register a user

exports.registerUser = catchAsyncErrors(async (req,res,next) =>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder : "avatar",
        width : 150,
        crop : "scale"
    })

    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar : {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    sendToken(user,201,res);

})


exports.loginUser = catchAsyncErrors(async (req,res,next) =>{

    const {email,password} = req.body;

    //check if user has given email and password both

    if(!email || !password){
        return next(new ErrorHander("Please Enter Email and Password",400))
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password"),401);
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return await next(new ErrorHander("Invalid2 email or password"),401);
    }
    sendToken(user,200,res);
    
})

//logout

exports.logOut = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires : new Date(Date.now()),
        httpOnly : true
    })
    res.status(200).json({
        success : true,
        message : "Logged Out"
    })
});

//forgot password

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHander("User not found",404));
    }

    //get reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave : false});
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `your password reset token is here :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please igonre it`;

    try{
        await sendEmail({
            email : user.email,
            subject : 'Ecommerce Password Recovery',
            message,
        })
        res.status(200).json({
            success : true,
            message : `Email sent to ${user.email} successfully`
        })

    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave : false});

        return next(new ErrorHander(error.message,500))
    }

})
//reset password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : { $gt:Date.now() }
    })
    if(!user){
        return next(new ErrorHander("Reset Password Token is Invalid or has been expired",400));
    }
    if (req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Password Does Not Match",404));
    }
user.password = req.body.password;
user.resetPasswordToken=undefined;
user.resetPasswordExpire=undefined;

await user.save();
sendToken(user,200,res);

})

//Get User Details 

exports.getUserDetails = catchAsyncErrors(async(req,res,err)=>{
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success : true,
        user,
    })
})

//update user password


exports.updatePassword = catchAsyncErrors(async(req,res,err)=>{
    const user = await User.findById(req.user.id).select("+password");
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched){
        return next(new ErrorHander("Incorrect Password",401))
    }

    if (req.body.newPassword !== req.body.confirmPassword ){
        return next(new ErrorHander("Password does not match",400));
    }
    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
})


//update user profile

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        
    }
    
    if (req.body.avatar!==""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;
        if (imageId!=='this is a sample id') await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder : "avatar",
            width : 150,
            crop : "scale"
        })

        newUserData.avatar = {
            public_id : myCloud.public_id,
            url : myCloud.secure_url
        }

    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success : true
    })


})

//get all users (admin)

exports.getAllUser = catchAsyncErrors(async (req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success : true,
        users
    })
})

//get single user (admin)

exports.getSingleUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.params.id);

    if (!user){
        return next(new ErrorHander(`User does not exist with Id : ${req.params.id}`,200))
    }

    res.status(200).json({
        success : true,
        user
    })
})

//update user role (admin)

exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
        
    }
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success : true
    })


})

//Delete user (admin)

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id)

    if (!user){
        return next(new ErrorHander(`User does not exist with Id : ${req.params.id}`,200))
    }

    await user.remove();

    res.status(200).json({
        success : true
    })
})

 
