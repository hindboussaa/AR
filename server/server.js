const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;





const key = process.env.STRIPE_SECRET_KEY;

console.log("Exists:", !!key);
console.log("Preview:", key?.substring(0, 10));
console.log("Length:", key?.length);

const stripe = Stripe(key);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Stripe backend is running...");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart = [] } = req.body;

    const line_items = cart.map(item => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
success_url: "https://your-domain.up.railway.app/success.html",
cancel_url: "https://your-domain.up.railway.app/cancel.html",
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});