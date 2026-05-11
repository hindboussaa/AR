const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Backend is working!");
});

app.use("/api/stripe", require("./routes/stripeRoutes"));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});