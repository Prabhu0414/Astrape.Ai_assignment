const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Create product (Admin only)
router.post("/", auth, admin, async (req, res) => {
  try {
    // Map frontend fields to backend model
    const { title, price, category, image } = req.body;
    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }
    const product = new Product({
      title,
      price,
      category,
      images: image ? [image] : [],
      inStock: true,
      createdBy: req.user._id
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update product
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete product
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get products (everyone)
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json({ products });
});

module.exports = router;
