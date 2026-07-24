import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bookRoutes from "./routes/book.routes";
import userRoutes from "./routes/user.routes";
import reservationRoutes from "./routes/reservation.routes";
import rentalRoutes from "./routes/rental.routes";
import adminRoutes from "./routes/admin/admin.routes";
import mfaRoutes from "./routes/mfa.routes";
import paymentRoutes from "./routes/payment.routes";
import { apiLimiter } from "./middleware/rateLimit.middlware";
import helmet from "helmet";


const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

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

// General API Rate Limiting
app.use("/api/books", apiLimiter);
app.use("/api/reservations", apiLimiter);
app.use("/api/rentals", apiLimiter);
app.use("/api/payment", apiLimiter);
app.use("/api/admin", apiLimiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/mfa", mfaRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);



export default app;