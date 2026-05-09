let mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    items: [{
      product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
      color: {type:String},
      size: {type:String},
      quantity: {type:Number}
    }]

}, { 
    timestamps: true 
});

let Cart = mongoose.model("Cart", cartSchema);

module.exports=Cart;