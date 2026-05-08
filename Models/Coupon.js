let mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

  code: {type:String},
  discountType: {type: String, enum: ["percent", "flat"]},
  discountValue: {type:Number},
  minOrderAmount: {type:Number},
  expireAt: {type:Date},
  active: {type: Boolean,default: true}

}, {
    timestamps: true 
});

let Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;