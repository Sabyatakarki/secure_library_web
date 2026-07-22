import Rental from "../../models/rental.model";
import Book from "../../models/book.model";
import Payment from "../../models/payment.model";
import { HttpError } from "../../error/http-error";

class AdminRentalService {
  // Get All Rentals
 async getAllRentals() {

  const rentals = await Rental.find()
    .populate(
      "user",
      "fullName email studentId department semester phoneNumber"
    )
    .populate(
      "book",
      "title author isbn category coverImage"
    )
    .sort({ createdAt: -1 });


  const rentalsWithPayment =
    await Promise.all(

      rentals.map(async (rental)=>{


        const payment =
          await Payment.findOne({
            rental: rental._id
          });



        return {

          ...rental.toObject(),

          payment: payment || null

        };


      })

    );


  return rentalsWithPayment;

}

  // Get Single Rental
  async getRentalById(
  rentalId:string
){

  const rental =
    await Rental.findById(rentalId)
    .populate(
      "user",
      "fullName email studentId department semester phoneNumber"
    )
    .populate(
      "book",
      "title author isbn category coverImage"
    );


  if(!rental){

    throw new HttpError(
      404,
      "Rental not found."
    );

  }



  const payment =
    await Payment.findOne({
      rental:rental._id
    });



  return {

    ...rental.toObject(),

    payment: payment || null

  };


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

    // Restore available copy
    const book = await Book.findById(rental.book);

    if (book) {
      book.availableCopies += 1;

      if (book.availableCopies > 0) {
        book.status = "Available";
      }

      await book.save();
    }

    return rental;
  }
}

export default new AdminRentalService();