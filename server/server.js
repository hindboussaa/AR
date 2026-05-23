require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("SERVER STARTED"); 

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ ONLY ONE CORS (FIXED)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

console.log("STRIPE KEY EXISTS:", !!process.env.STRIPE_SECRET_KEY);

// ================================
// STRIPE CHECKOUT
// ================================
app.post("/create-checkout-session", async (req, res) => {

  try {
    const cart = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Invalid cart" });
    }

    const line_items = cart.map(item => ({
      price_data: {
        currency: "gbp",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: "https://ar-production-006f.up.railway.app/success.html",
      cancel_url: "https://ar-production-006f.up.railway.app/cancel.html",
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ================================
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});