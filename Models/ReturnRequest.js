let mongoose = require("mongoose");


const returnSchema = new mongoose.Schema({

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  reason: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "picked"],
    default: "pending"
  }

}, { timestamps: true });

let ReturnRequest = mongoose.model("ReturnRequest", returnSchema);

module.exports=ReturnRequest;