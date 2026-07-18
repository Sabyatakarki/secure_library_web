import { Router } from "express";
import rentalController from "../controllers/rental.controller";
import { authorizedMiddleware } from "../middleware/auth.middlware";

const router = Router();


// Student: Get My Rentals
router.get(
  "/my",
  authorizedMiddleware,
  rentalController.getMyRentals
);


// Student: Return Book
router.put(
  "/return/:rentalId",
  authorizedMiddleware,
  rentalController.returnBook
);


export default router;