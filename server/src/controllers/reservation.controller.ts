import { Request, Response } from "express";
import reservationService from "../services/resevation.service";

class ReservationController {
  // Reserve a Book
  async reserveBook(
    req: Request<{ bookId: string }>,
    res: Response
  ) {
    try {
      const result = await reservationService.reserveBook(
        req.user!._id.toString(),
        req.params.bookId
      );

      return res.status(201).json({
        success: true,
        message: "Book reserved successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get Logged-in Student Reservations
  async getMyReservations(
    req: Request,
    res: Response
  ) {
    try {
      const result = await reservationService.getMyReservations(
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

  // Cancel Reservation
  async cancelReservation(
    req: Request<{ reservationId: string }>,
    res: Response
  ) {
    try {
      const result =
        await reservationService.cancelReservation(
          req.params.reservationId,
          req.user!._id.toString()
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

export default new ReservationController();