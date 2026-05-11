const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  items: [
    {
      name: String,
      price: Number,
      qty: Number
    }
  ],

  total: Number,

  paymentStatus: {
    type: String,
    default: "paid"
  },

  stripeSessionId: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", orderSchema);