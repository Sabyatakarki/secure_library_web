import Reservation from "../../models/reservation.model";
import Rental from "../../models/rental.model";
import { HttpError } from "../../error/http-error";

class AdminReservationService {
  // Get All Reservations
  async getAllReservations() {
    return await Reservation.find()
      .populate("user")
      .populate("book")
      .sort({ createdAt: -1 });
  }

  // Approve Reservation
  async approveReservation(reservationId: string) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new HttpError(404, "Reservation not found.");
    }

    if (reservation.status !== "Pending") {
      throw new HttpError(
        400,
        "Reservation has already been processed."
      );
    }

    reservation.status = "Approved";
    await reservation.save();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const rental = await Rental.create({
      user: reservation.user,
      book: reservation.book,
      reservation: reservation._id,
      rentalDate: new Date(),
      dueDate,
      status: "Borrowed",
    });

    return rental;
  }

  // Cancel Reservation
  async cancelReservation(reservationId: string) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new HttpError(404, "Reservation not found.");
    }

    if (reservation.status !== "Pending") {
      throw new HttpError(
        400,
        "Reservation has already been processed."
      );
    }

    reservation.status = "Cancelled";
    await reservation.save();

    return reservation;
  }
}

export default new AdminReservationService();