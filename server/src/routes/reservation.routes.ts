import { Router } from "express";
import reservationController from "../controllers/reservation.controller";
import { authorizedMiddleware } from "../middleware/auth.middlware";

const router = Router();


// Student: Get own reservations
router.get(
  "/my",
  authorizedMiddleware,
  reservationController.getMyRentals
);


// Student: Reserve book
router.post(
  "/:bookId",
  authorizedMiddleware,
  reservationController.getMyRentals
);


// Student: Cancel reservation
router.put(
  "/cancel/:reservationId",
  authorizedMiddleware,
  reservationController.getMyRentals
);


export default router;