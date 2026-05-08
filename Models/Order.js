let mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    orderItems:[{
        product:{type:mongoose.Schema.Types.ObjectId, ref:"Product"},
        tittle:{type:String},
        image:{type:String},
        color:{type:String},
        size:{type:String},
        quantity:{type:Number},
        price:{type:Number}
    }],
    shippingAddress:{
        fullName:{type:String},
        phone:{type:String},
        pincode:{type:String},
        city:{type:String},
        state:{type:String},
        area:{type:String},
        houseNo:{type:String}
    },
    paymentMethod: {type: String,enum: ["COD", "Razorpay", "Stripe"]},
    paymentStatus: {type: String, enum: ["pending", "paid"],default: "pending"},
    couponCode: {type:String},
    itemsPrice: {type:Number},
    shippingPrice: {type:Number},
    discountPrice: {type:Number},
    totalPrice: {type:Number},
    orderStatus: {type: String, enum: ["placed", "packed", "shipped", "out for delivery", "delivered", "cancelled"],default: "placed" },
    trackingId: {type:String},
    estimatedDelivery: {type:Date}    
},{
    timestamps:true
});

let Order = mongoose.model("Order", orderSchema);

module.exports=Order;