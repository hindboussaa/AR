const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
const stripe = Stripe("YOUR_SECRET_KEY");

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const items = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map(item => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    })),
    mode: "payment",
    success_url: "http://localhost:3000/success.html",
    cancel_url: "http://localhost:3000",
  });

  res.json({ id: session.id });
});

app.listen(3000, () => console.log("Server running on port 3000"));