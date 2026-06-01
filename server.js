require("dotenv").config();
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("./models/Order");
const Product = require("./models/Product"); 

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// CONNECT DB
// ======================
connectDB();

// ======================
// PRODUCT LIST (MOVE TO DB LATER)
// ======================
const products = [
  { id: 1, name: "Yara Pink 50ml", price: 15.99 },
  { id: 2, name: "Choco Musk Pistachio", price: 6.99 },
  { id: 3, name: "Dirham Oud 100ml", price: 19.99 },
  { id: 4, name: "Qaed Al Fursan Unlimited", price: 21.99 },
  { id: 5, name: "Mousuf Ramadi", price: 19.99 },
  { id: 11, name: "Mayar by Lattafa", price: 26.99 }
];

// ======================
// WEBHOOK (MUST BE BEFORE JSON MIDDLEWARE)
// ======================
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // PAYMENT SUCCESS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return res.status(400).send("Missing orderId");
      }

      await Order.findByIdAndUpdate(
        orderId,
        {
          status: "paid",
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent
        },
        { new: true }
      );

      console.log("ORDER MARKED PAID:", orderId);
    }

    res.json({ received: true });
  }
);

// ======================
// MIDDLEWARE
// ======================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ======================
// HEALTH CHECK
// ======================
app.get("/ping", (req, res) => {
  res.send("pong");
});

// ======================
// ORDERS (ADMIN ONLY)
// ======================
app.get("/orders", async (req, res) => {
  const key = req.headers["x-admin-key"];

  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// CHECKOUT (SECURE)
// ======================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const cart = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    let total = 0;

    const line_items = cart.map(item => {
      const product = products.find(p => p.id === item.id);

      if (!product) {
        throw new Error("Invalid product ID: " + item.id);
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.name
          },
          unit_amount: Math.round(product.price * 100)
        },
        quantity: item.quantity
      };
    });

   
    




    const orderItems = await Promise.all(
  cart.map(async (item) => {
    const product = await Product.findById(item.id);

    if (!product) {
      throw new Error("Invalid product: " + item.id);
    }

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      img: product.img
    };
  })
);



const order = await Order.create({
  items: orderItems,
  total,
  status: "pending"
});


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,

      metadata: {
        orderId: order._id.toString()
      },

      success_url: "https://www.arsishop.co.uk/success.html",
      cancel_url: "https://www.arsishop.co.uk/cancel.html"
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ======================
// START SERVER
// ======================
app.listen(PORT, "0.0.0.0", () => {
  console.log("SERVER RUNNING ON PORT:", PORT);
});