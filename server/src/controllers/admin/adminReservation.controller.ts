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
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Approve Reservation
  async approveReservation(req: Request, res: Response) {
    try {
      let { reservationId } = req.params as { reservationId?: string | string[] };
      if (Array.isArray(reservationId)) reservationId = reservationId[0];
      if (!reservationId) {
        return res.status(400).json({ success: false, message: "reservationId is required" });
      }

      const rental = await adminReservationService.approveReservation(reservationId);

      return res.status(200).json({
        success: true,
        message: "Reservation approved successfully.",
        data: rental,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Cancel Reservation
  async cancelReservation(req: Request, res: Response) {
    try {
      let { reservationId } = req.params as { reservationId?: string | string[] };
      if (Array.isArray(reservationId)) reservationId = reservationId[0];
      if (!reservationId) {
        return res.status(400).json({ success: false, message: "reservationId is required" });
      }

      const reservation = await adminReservationService.cancelReservation(reservationId);

      return res.status(200).json({
        success: true,
        message: "Reservation cancelled successfully.",
        data: reservation,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AdminReservationController();