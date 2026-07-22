import Reservation from "../models/reservation.model";
import Book from "../models/book.model";
import Rental from "../models/rental.model";
import { HttpError } from "../error/http-error";
import activityLogService from "./admin/activityLogs.service";
import userRepository from "../repositories/user.repository";

class ReservationService {
  async reserveBook(userId: string, bookId: string,ipAddress?: string) {

    const book = await Book.findById(bookId);

    if (!book) {
      throw new HttpError(
        404,
        "Book not found."
      );
    }


    if (book.availableCopies <= 0) {
      throw new HttpError(
        400,
        "Book is not available."
      );
    }


    const existingReservation =
      await Reservation.findOne({
        user: userId,
        book: bookId,
        status: {
          $in: [
            "Pending",
            "Approved"
          ]
        },
      });


    if (existingReservation) {
      throw new HttpError(
        400,
        "You have already reserved this book."
      );
    }



    const reservation =
      await Reservation.create({
        user: userId,
        book: bookId,
      });



    // Hold one copy for reservation
    book.availableCopies -= 1;


    if (book.availableCopies === 0) {
      book.status = "Unavailable";
    }


    await book.save();
  const user = await userRepository.findById(userId);

await activityLogService.create({
  user,
  action: "Book Reserved",
  description: `${user?.fullName} reserved "${book.title}"`,
  ipAddress,
});


    return reservation;
  }

  async getMyReservations(userId:string){

    return await Reservation.find({
      user:userId,
    })
    .populate("book")
    .sort({
      createdAt:-1
    });

  }

  async cancelReservation(
    reservationId:string,
    userId:string
  ){

    const reservation =
      await Reservation.findOne({
        _id:reservationId,
        user:userId,
      });



    if(!reservation){

      throw new HttpError(
        404,
        "Reservation not found."
      );

    }



    // Student can cancel only pending
    if(reservation.status !== "Pending"){

      throw new HttpError(
        400,
        "Only pending reservations can be cancelled."
      );

    }



    reservation.status="Cancelled";

    await reservation.save();



    // Restore book copy

    const book =
      await Book.findById(
        reservation.book
      );


    if(book){

      book.availableCopies += 1;

      book.status="Available";

      await book.save();

    }



    return {
      message:
      "Reservation cancelled successfully."
    };

  }

//Admin
  async getAllReservations(){

    return await Reservation.find()
      .populate(
        "user",
        "fullName email studentId"
      )
      .populate(
        "book",
        "title author isbn"
      )
      .sort({
        createdAt:-1
      });

  }
 async approveReservation(
  reservationId: string,
  librarianId: string
){ 


    const reservation =
      await Reservation.findById(
        reservationId
      );



    if(!reservation){

      throw new HttpError(
        404,
        "Reservation not found."
      );

    }



    if(reservation.status !== "Pending"){

      throw new HttpError(
        400,
        "Reservation already processed."
      );

    }



    reservation.status="Approved";

    reservation.approvedBy =
      librarianId as any;



    await reservation.save();




    // Create rental automatically

    const dueDate = new Date();

    dueDate.setDate(
      dueDate.getDate()+14
    );



    const rental =
      await Rental.create({

        user:
          reservation.user,


        book:
          reservation.book,


        reservation:
          reservation._id,


        dueDate,


        status:
          "Borrowed"

      });

      const librarian = await userRepository.findById(librarianId);

const student = await userRepository.findById(
  reservation.user.toString()
);

const book = await Book.findById(
  reservation.book.toString()
);

await activityLogService.create({
  user: librarian,
  action: "Reservation Approved",
  description: `${librarian?.fullName} approved "${book?.title}" for ${student?.fullName}`,
});



    return rental;

  }

  async cancelReservationByLibrarian(
  reservationId: string,
  librarianId: string
){


    const reservation =
      await Reservation.findById(
        reservationId
      );



    if(!reservation){

      throw new HttpError(
        404,
        "Reservation not found."
      );

    }



    if(reservation.status !== "Pending"){

      throw new HttpError(
        400,
        "Only pending reservations can be cancelled."
      );

    }



    reservation.status="Cancelled";


    await reservation.save();




    // Return book copy

    const book =
      await Book.findById(
        reservation.book
      );


    if(book){

      book.availableCopies += 1;

      book.status="Available";


      await book.save();

   const librarian = await userRepository.findById(
  librarianId
);

const student = await userRepository.findById(
  String(reservation.user)
);

await activityLogService.create({
  user: librarian,
  action: "Reservation Cancelled",
  description: `${librarian?.fullName} cancelled ${student?.fullName}'s reservation for "${book?.title}"`,
  ipAddress: undefined,
});

    }
    



    return {
      message:
      "Reservation cancelled by librarian."
    };

  }


}


export default new ReservationService();