import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});