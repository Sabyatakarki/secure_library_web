import { Router } from "express";
import reservationController from "../controllers/reservation.controller";
import { authorizedMiddleware } from "../middleware/auth.middlware";

const router = Router();

// Reserve a Book
router.post(
  "/:bookId",
  authorizedMiddleware,
  reservationController.reserveBook
);

// Get Logged-in Student Reservations
router.get(
  "/my-reservations",
  authorizedMiddleware,
  reservationController.getMyReservations
);

// Cancel Reservation
router.put(
  "/cancel/:reservationId",
  authorizedMiddleware,
  reservationController.cancelReservation
);

export default router;