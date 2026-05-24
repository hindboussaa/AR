require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

console.log("SERVER STARTED");
console.log("STRIPE KEY EXISTS:", !!process.env.STRIPE_SECRET_KEY);

// ✅ CLEAN CORS (ONLY ONCE)
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
// STRIPE ROUTE
// ======================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const cart = req.body;

    console.log("CART RECEIVED:", cart);

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,

   success_url: "http://localhost:3000/success.html",
cancel_url: "http://localhost:3000/cancel.html"
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ======================
// START SERVER
// ======================
app.listen(PORT, "0.0.0.0", () => {
  console.log("SERVER RUNNING ON PORT:", PORT);
});