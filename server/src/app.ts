import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bookRoutes from "./routes/book.routes";
import userRoutes from "./routes/user.routes";
import reservationRoutes from "./routes/reservation.routes";
import rentalRoutes from "./routes/rental.routes";
import adminRoutes from "./routes/admin/admin.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse Cookies (Must come before routes)
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3003",
    ],
    credentials: true,
  })
);

// Static Files
app.use(
  "/uploads/profile_pictures",
  express.static(path.join(__dirname, "../public/profile_pictures"))
);

app.use(
  "/uploads/book_covers",
  express.static(path.join(__dirname, "../public/book_covers"))
);


// Routes
app.use("/api/users", userRoutes);

app.use("/api/books", bookRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/rentals", rentalRoutes);

app.use("/api/admin", adminRoutes);

export default app;