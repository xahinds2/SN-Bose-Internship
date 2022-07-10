const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please Enter product Name"]
    },
    description : {
        type : String,
        required : [true, "Please Enter description"]
    },
    price : {
        type : Number,
        required : [true, "Please Enter Product Price"],
        maxLength : [6, "Price cannot exceed 6 figures"]
    },
    ratings : {
        type : Number,
        default : 0
    },
    numOfReviews : {
        type : Number,
        default : 0
    },
    images : [{
        public_id:{
            type : String,
            required : true
        },
        url:{
            type : String,
            required : true
        }
    }
    ],
    category : {

        type : String,
        required : [true , "Please Enter Product Category"],

    },
    Stock : {
        type : Number,
        required : [true,"Please Enter Product Stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default : 1
    },

    reviews : [{
        user:{
            type : mongoose.Schema.ObjectId,
            ref : "User",
            required : true,
        },
        name : {
            type : String,
            required : true
        },
        rating : {
            type : Number,
            required : true
        },
        comment : {
            type : String,
            required : true
        }

    }],

    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
    }
    ,
    createdAt : {
        type : Date,
        default : Date.now()
    }

})

module.exports = mongoose.model("Product",productSchema)