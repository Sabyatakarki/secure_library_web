import { Router } from "express";
import reservationController from "../controllers/reservation.controller";
import { authorizedMiddleware } from "../middleware/auth.middlware";

const router = Router();


// Student: Get own reservations
router.get(
  "/my",
  authorizedMiddleware,
  reservationController.getMyReservations
);


// Student: Reserve book
router.post(
  "/:bookId",
  authorizedMiddleware,
  reservationController.reserveBook
);


// Student: Cancel reservation
router.put(
  "/cancel/:reservationId",
  authorizedMiddleware,
  reservationController.cancelReservation
);


export default router;