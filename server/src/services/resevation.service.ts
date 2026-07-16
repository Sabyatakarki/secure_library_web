import Reservation from "../models/reservation.model";
import Book from "../models/book.model";
import { HttpError } from "../error/http-error";

class ReservationService {
  // Reserve a Book
  async reserveBook(userId: string, bookId: string) {
    // Check if the book exists
    const book = await Book.findById(bookId);

    if (!book) {
      throw new HttpError(404, "Book not found.");
    }

    // Check availability
    if (book.availableCopies <= 0) {
      throw new HttpError(400, "Book is not available.");
    }

    // Check if student already reserved this book
    const existingReservation = await Reservation.findOne({
      user: userId,
      book: bookId,
      status: { $in: ["Pending", "Approved"] },
    });

    if (existingReservation) {
      throw new HttpError(
        400,
        "You have already reserved this book."
      );
    }

    // Create reservation
    const reservation = await Reservation.create({
      user: userId,
      book: bookId,
    });

    // Reduce available copies
    book.availableCopies -= 1;

    // Update status automatically
    if (book.availableCopies === 0) {
      book.status = "Unavailable";
    }

    await book.save();

    return reservation;
  }

  // Get Logged-in Student Reservations
  async getMyReservations(userId: string) {
    return await Reservation.find({
      user: userId,
    })
      .populate("book")
      .sort({ createdAt: -1 });
  }

  // Cancel Reservation
  async cancelReservation(
    reservationId: string,
    userId: string
  ) {
    const reservation = await Reservation.findOne({
      _id: reservationId,
      user: userId,
    });

    if (!reservation) {
      throw new HttpError(
        404,
        "Reservation not found."
      );
    }

    if (reservation.status === "Cancelled") {
      throw new HttpError(
        400,
        "Reservation already cancelled."
      );
    }

    reservation.status = "Cancelled";
    await reservation.save();

    // Restore available copies
    const book = await Book.findById(reservation.book);

    if (book) {
      book.availableCopies += 1;
      book.status = "Available";
      await book.save();
    }

    return {
      message: "Reservation cancelled successfully.",
    };
  }
}

export default new ReservationService();