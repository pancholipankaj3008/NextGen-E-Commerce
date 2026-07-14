let mongoose = require("mongoose");


const returnSchema = new mongoose.Schema({

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    unique: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "picked"],
    default: "pending"
  }

}, { timestamps: true });

let ReturnRequest = mongoose.model("ReturnRequest", returnSchema);

module.exports=ReturnRequest;
