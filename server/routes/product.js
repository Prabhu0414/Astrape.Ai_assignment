const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// Create product
router.post("/", auth, async (req, res) => {
  try {
    const p = new Product({ ...req.body, createdBy: req.user._id });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Read with filters
router.get("/", async (req, res) => {
  try {
  const { search, category, priceMin, priceMax, sort, page = 1, limit } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (priceMin || priceMax) filter.price = {};
    if (priceMin) filter.price.$gte = Number(priceMin);
    if (priceMax) filter.price.$lte = Number(priceMax);

    let q = Product.find(filter);
    if (sort === "price_asc") q = q.sort({ price: 1 });
    else if (sort === "price_desc") q = q.sort({ price: -1 });
    else if (sort === "newest") q = q.sort({ createdAt: -1 });

    let products, total;
    if (limit) {
      const skip = (Number(page) - 1) * Number(limit);
      total = await Product.countDocuments(filter);
      products = await q.skip(skip).limit(Number(limit));
    } else {
      products = await q;
      total = products.length;
    }
    res.json({ total, page: Number(page), limit: limit ? Number(limit) : undefined, products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Single product
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update
router.put("/:id", auth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    if (p.createdBy && p.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    Object.assign(p, req.body);
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    if (p.createdBy && p.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    await p.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" })
  const { name, price, category, image } = req.body
  const product = new Product({ name, price, category, image })
  await product.save()
  res.json(product)
})

module.exports = router;
