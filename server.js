require("dotenv").config();
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("./models/Order");

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// CONNECT DATABASE
// ======================
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("SERVER STARTED");
console.log("STRIPE KEY EXISTS:", !!process.env.STRIPE_SECRET_KEY);

connectDB();

// ======================
// MIDDLEWARE
// ======================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ======================
// STATIC FRONTEND
// ======================
app.use(express.static(path.join(__dirname, "public")));

// ======================
// STRIPE CHECKOUT ROUTE
// ======================
app.post("/create-checkout-session", async (req, res) => {
  try {

    const cart = req.body;

    console.log("CART RECEIVED:", cart);

    // ======================
    // VALIDATE CART
    // ======================
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        error: "Cart empty"
      });
    }

    // ======================
    // STRIPE LINE ITEMS
    // ======================
    const line_items = cart.map(item => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity || 1
    }));

    // ======================
    // SAVE ORDER TO MONGODB
    // ======================
    const newOrder = await Order.create({
      items: cart,

      total: cart.reduce(
        (sum, item) =>
          sum + (item.price * item.quantity),
        0
      ),

      createdAt: new Date()
    });

    console.log("ORDER SAVED:", newOrder);

    // ======================
    // CREATE STRIPE SESSION
    // ======================
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items,

    success_url: "https://www.arsishop.co.uk/success.html",
cancel_url: "https://www.arsishop.co.uk/cancel.html"
    });

    // ======================
    // RETURN STRIPE URL
    // ======================
    res.json({
      url: session.url
    });

  } catch (err) {

    console.error("STRIPE ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

// ======================
// START SERVER
// ======================
app.listen(PORT, "0.0.0.0", () => {
  console.log("SERVER RUNNING ON PORT:", PORT);
});