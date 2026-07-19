import { Router } from "express";
import { authorizedMiddleware } from "../../middleware/auth.middlware";
import adminRentalController from "../../controllers/admin/adminRental.controller";
import { AdminUserController } from "../../controllers/admin/adminUser.controller";
import adminReservationController from "../../controllers/admin/adminReservation.controller";

import { uploads } from "../../middleware/upload.middlware";


const router = Router();

const adminUserController = new AdminUserController();


// Authentication for all admin routes
router.use(authorizedMiddleware);


// ======================
// ADMIN USER MANAGEMENT
// ======================

router.post(
  "/users",
  uploads.profile.single("image"),
  adminUserController.createUser
);


router.get(
  "/users",
  adminUserController.getAllUsers
);


router.get(
  "/users/:id",
  adminUserController.getUserById
);


router.put(
  "/users/:id",
  uploads.profile.single("image"),
  adminUserController.updateUser
);


router.delete(
  "/users/:id",
  adminUserController.deleteUser
);



// ======================
// ADMIN RESERVATIONS
// ======================


// Get all student reservations
router.get(
  "/reservations",
  adminReservationController.getAllReservations
);


// Approve reservation
router.put(
  "/reservations/approve/:reservationId",
  adminReservationController.approveReservation
);


// Reject/Cancel reservation
router.put(
  "/reservations/cancel/:reservationId",
  adminReservationController.cancelReservation
);


router.get(
  "/rentals",
  adminRentalController.getAllRentals
);

// Get single rental
router.get(
  "/rentals/:rentalId",
  adminRentalController.getRentalById
);

// Return book
router.put(
  "/rentals/return/:rentalId",
  adminRentalController.returnBook
);



export default router;