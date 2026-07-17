import { Router } from "express";
import adminReservationController from "../../controllers/admin/adminReservation.controller";
import { authorizedMiddleware } from "../../middleware/auth.middlware";

const router = Router();

// Get all reservations
router.get(
  "/reservations",
  authorizedMiddleware,
  adminReservationController.getAllReservations
);

// Approve reservation
router.put(
  "/reservations/approve/:reservationId",
  authorizedMiddleware,
  adminReservationController.approveReservation
);

// Cancel reservation
router.put(
  "/reservations/cancel/:reservationId",
  authorizedMiddleware,
  adminReservationController.cancelReservation
);

export default router;