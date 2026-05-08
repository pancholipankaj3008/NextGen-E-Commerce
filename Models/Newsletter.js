let mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  }
}, { timestamps: true });

let Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports=Newsletter;