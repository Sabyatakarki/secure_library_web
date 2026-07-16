import { Router } from "express";
import rentalController from "../controllers/rental.controller";
import { authorizedMiddleware } from "../middleware/auth.middlware";

const router = Router();

// Create Rental
router.post(
  "/:reservationId",
  authorizedMiddleware,
  rentalController.createRental
);

// Logged-in Student Rentals
router.get(
  "/my-rentals",
  authorizedMiddleware,
  rentalController.getMyRentals
);

// Return Book
router.put(
  "/return/:rentalId",
  authorizedMiddleware,
  rentalController.returnBook
);

export default router;