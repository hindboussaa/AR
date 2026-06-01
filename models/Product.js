app.get("/seed-products", async (req, res) => {
  try {
    await Product.deleteMany(); // optional: clears old products

    await Product.create([
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