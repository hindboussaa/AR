require("dotenv").config();
console.log("STRIPE KEY EXISTS:", !!process.env.STRIPE_SECRET_KEY);




console.log("BODY:", req.body);
console.log("TYPE:", typeof req.body);
console.log("ARRAY:", Array.isArray(req.body));

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(publicPath, "favicon.ico"));
});





app.post("/create-checkout-session", async (req, res) => {
  try {

    let cart = req.body;

    // 👇 ADD IT RIGHT HERE
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Invalid cart" });
    }

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://ar-production-006f.up.railway.app/success.html",
      cancel_url: "https://ar-production-006f.up.railway.app/cancel.html",
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});