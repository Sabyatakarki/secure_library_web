import { Request, Response } from "express";
import rentalService from "../services/rental.service";

class RentalController {
  // Create Rental
  async createRental(
    req: Request<{ reservationId: string }>,
    res: Response
  ) {
    try {
      const result = await rentalService.createRental(
        req.params.reservationId
      );

      return res.status(201).json({
        success: true,
        message: "Book rented successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get Logged-in Student Rentals
  async getMyRentals(req: Request, res: Response) {
    try {
      const result = await rentalService.getMyRentals(
        req.user!._id.toString()
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Return Book
  async returnBook(
    req: Request<{ rentalId: string }>,
    res: Response
  ) {
    try {
      const result = await rentalService.returnBook(
        req.params.rentalId
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new RentalController();