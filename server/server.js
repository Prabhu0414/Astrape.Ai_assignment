import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authroutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// connect to mongo
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// routes
app.use("/api/auth", authroutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
