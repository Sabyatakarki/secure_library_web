import Rental from "../models/rental.model";
import Reservation from "../models/reservation.model";
import Book from "../models/book.model";
import { HttpError } from "../error/http-error";

class RentalService {
  // Create Rental
  async createRental(reservationId: string) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new HttpError(404, "Reservation not found.");
    }

    if (reservation.status !== "Approved") {
      throw new HttpError(
        400,
        "Reservation must be approved before renting."
      );
    }

    // Check if rental already exists
    const existingRental = await Rental.findOne({
      reservation: reservationId,
    });

    if (existingRental) {
      throw new HttpError(
        400,
        "Rental already exists for this reservation."
      );
    }

    // Due date = 14 days from today
    const dueDate = new Date();
dueDate.setMinutes(dueDate.getMinutes() + 1);

    const rental = await Rental.create({
      user: reservation.user,
      book: reservation.book,
      reservation: reservation._id,
      dueDate,
    });

    return await Rental.findById(rental._id)
.populate("book")
.populate("user");
  }

  // Get Logged-in Student Rentals
  async getMyRentals(userId: string) {
    return await Rental.find({
      user: userId,
    })
      .populate("book")
      .sort({ createdAt: -1 });
  }

  // Return Book
  async returnBook(rentalId: string) {
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      throw new HttpError(404, "Rental not found.");
    }

    if (rental.status === "Returned") {
      throw new HttpError(
        400,
        "Book has already been returned."
      );
    }

    rental.status = "Returned";
    rental.returnDate = new Date();

    await rental.save();

    // Restore book availability
    const book = await Book.findById(rental.book);

    if (book) {
      book.availableCopies += 1;

      if (book.availableCopies > 0) {
        book.status = "Available";
      }

      await book.save();
    }

    return {
      message: "Book returned successfully.",
    };
  }
}

export default new RentalService();