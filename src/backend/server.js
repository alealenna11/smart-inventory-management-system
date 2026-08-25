
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import inventoryRoutes from "./routes/inventory.js";
import userManagementRoutes from "./routes/userManagement.js";

dotenv.config();

const app = express();

/* ========================= */
/* MIDDLEWARE */
/* ========================= */

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);
// JSON Parser
app.use(express.json());

/* ========================= */
/* ROUTES */
/* ========================= */

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/user-management", userManagementRoutes);
/* ========================= */
/* HEALTH CHECK */
/* ========================= */

app.get("/", (req, res) => {
  res.send("API running");
});

/* ========================= */
/* GLOBAL ERROR HANDLER */
/* ========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);

  res.status(500).json({
    message: "Something went wrong on server",
  });
});

/* ========================= */
/* DATABASE CONNECTION */
/* ========================= */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("DB CONNECTION ERROR:", err);
    process.exit(1);
  }
};

connectDB();