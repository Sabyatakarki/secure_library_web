import { Request, Response } from "express";
import adminReservationService from "../../services/admin/adminReservation.service";

class AdminReservationController {
  // Get All Reservations
  async getAllReservations(req: Request, res: Response) {
    try {
      const reservations =
        await adminReservationService.getAllReservations();

      return res.status(200).json({
        success: true,
        message: "Reservations fetched successfully.",
        data: reservations,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Approve Reservation
  async approveReservation(req: Request, res: Response) {
    try {
      const reservationId = Array.isArray(req.params.reservationId)
        ? req.params.reservationId[0]
        : req.params.reservationId;

      const result = await adminReservationService.approveReservation(
        String(reservationId)
      );

      return res.status(200).json({
        success: true,
        message: "Reservation approved successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Reject Reservation
  async rejectReservation(req: Request, res: Response) {
    try {
      const reservationId = Array.isArray(req.params.reservationId)
        ? req.params.reservationId[0]
        : req.params.reservationId;

      const result = await (adminReservationService as any).rejectReservation(
        String(reservationId)
      );

      return res.status(200).json({
        success: true,
        message: "Reservation rejected successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AdminReservationController();