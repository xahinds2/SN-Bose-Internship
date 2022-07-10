const Order = require("../models/orderModel")
const Product = require("../models/productModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorHandler");

//create new order

exports.newOrder = catchAsyncErrors(async (req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id
    })

    res.status(200).json({
        success : true,
        order
    })
})

// get single order

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");

    if (!order){
        return next(new ErrorHander("Order not found with this Id",404))
    }
    res.status(200).json({
        success : true,
        order,
    })
})
// get logged in user order

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find({user : req.user._id});
    res.status(200).json({
        success : true,
        orders,
    })
})


//get all orders -- Addmin 

exports.getAllOrders = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success : true,
        totalAmount,
        orders,
    })

})

//update order status -- Admin 

exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if (!order){
        return next(new ErrorHander("Order not found with this Id",404))
    }

    if (order.orderStatus==="Delivered"){
        return next(new ErrorHander("You have already delivered this order",400));
    }
    if (req.body.status==="Shipped"){
    order.orderItems.forEach(async (odr)=>await updateStock(odr.product,odr.quantity));
    }
    order.orderStatus = req.body.status;

    if (req.body.status==="Delivered"){
    order.deliveredAt = Date.now()
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success : true,
        order,
    })

})

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;
    await product.save({validateBeforeSave : false})
}

//delete order -- Addmin 

exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if (!order){
        return next(new ErrorHander("Order not found with this Id",404))
    }

    await order.remove()

    res.status(200).json({
        success : true
    })

})