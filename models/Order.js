const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
      img: String
    }
  ],

  total: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending"
  },

  stripeSessionId: String,
  stripePaymentIntentId: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);