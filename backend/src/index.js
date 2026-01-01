import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import jwt from "jsonwebtoken";
const app = express();

app.use(cors());
app.use(express.json());

// test route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", authRoutes);
app.get("/api/protected", (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      jwt.verify(token, "secret");
      res.json({ message: "You are authorized" });
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

app.listen(5001, () => {
    console.log("Server running on port 5001");
  });
  