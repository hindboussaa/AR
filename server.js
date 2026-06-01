require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const connectDB = require("./config/db");
const Order = require("./models/Order");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// DB CONNECT
// ======================
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
app.use(express.static(path.join(__dirname, "public")));

// ======================
// HEALTH CHECK
// ======================
app.get("/ping", (req, res) => {
  res.send("pong");
});

// ======================
// PRODUCTS
// ======================
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// SEED PRODUCTS
// ======================
app.get("/seed-products", async (req, res) => {
  try {
    await Product.deleteMany();

    await Product.insertMany([
      {
        name: "Yara Pink 50ml",
        price: 15.99,
        img: "images/yara.png",
        stock: 10
      },
      {
        name: "Choco Musk Pistachio",
        price: 6.99,
        img: "images/choco.png",
        stock: 20
      },
      {
        name: "Dirham Oud 100ml",
        price: 19.99,
        img: "images/dirham.png",
        stock: 15
      },
      {
        name: "Qaed Al Fursan",
        price: 21.99,
        img: "images/forsan.png",
        stock: 12
      }
    ]);

    res.send("Products seeded successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// ORDERS (ADMIN ONLY)
// ======================
app.get("/orders", async (req, res) => {
  try {
    const key = req.headers["x-admin-key"];

    if (key !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// STRIPE WEBHOOK
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
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {

      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          status: "paid",
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent
        });

        console.log("ORDER PAID:", orderId);
      }
    }

    res.json({ received: true });
  }
);

// ======================
// CHECKOUT (FINAL FIXED VERSION)
// ======================
app.post("/create-checkout-session", async (req, res) => {

  try {

    const cart = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    let total = 0;
    const line_items = [];
    const orderItems = [];

    for (const item of cart) {

      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return res.status(400).json({
          error: `Invalid product ID: ${item.id}`
        });
      }

      const product = await Product.findById(item.id);

      if (!product) {
        return res.status(400).json({
          error: "Product not found"
        });
      }

      total += product.price * item.quantity;

      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.name
          },
          unit_amount: Math.round(product.price * 100)
        },
        quantity: item.quantity
      });

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        img: product.img
      });
    }

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