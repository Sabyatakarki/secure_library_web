import express from "express";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Secure Library API is running...",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;