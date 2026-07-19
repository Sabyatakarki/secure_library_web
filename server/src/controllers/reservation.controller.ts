import { Request, Response } from "express";
import reservationService from "../services/resevation.service";

class ReservationController {


  // Student: Reserve Book
  async reserveBook(
    req: Request<{ bookId: string }>,
    res: Response
  ) {

    try {

      const result =
        await reservationService.reserveBook(
          req.user!._id.toString(),
          req.params.bookId
        );


      return res.status(201).json({

        success: true,

        message: "Book reserved successfully.",

        data: result

      });


    } catch (error: any) {

      return res.status(
        error.statusCode || 400
      ).json({

        success: false,

        message: error.message

      });

    }

  }



  // Student: View My Reservations
  async getMyReservations(
    req: Request,
    res: Response
  ) {

    try {

      const result =
        await reservationService.getMyReservations(
          req.user!._id.toString()
        );


      return res.status(200).json({

        success: true,

        data: result

      });


    } catch (error: any) {

      return res.status(
        error.statusCode || 400
      ).json({

        success: false,

        message: error.message

      });

    }

  }




  // Student: Cancel Reservation
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

        message: result.message

      });


    } catch (error: any) {

      return res.status(
        error.statusCode || 400
      ).json({

        success: false,

        message: error.message

      });

    }

  }





  // Admin: View All Reservations
  async getAllReservations(
    req: Request,
    res: Response
  ) {

    try {

      const result =
        await reservationService.getAllReservations();


      return res.status(200).json({

        success: true,

        data: result

      });


    } catch (error: any) {

      return res.status(
        error.statusCode || 400
      ).json({

        success:false,

        message:error.message

      });

    }

  }





  // Admin: Approve Reservation
  async approveReservation(
    req: Request<{ reservationId: string }>,
    res: Response
  ) {

    try {

      const result =
        await reservationService.approveReservation(
          req.params.reservationId,
          req.user!._id.toString()
        );


      return res.status(200).json({

        success:true,

        message:"Reservation approved successfully.",

        data:result

      });


    } catch(error:any){

      return res.status(
        error.statusCode || 400
      ).json({

        success:false,

        message:error.message

      });

    }

  }





  // Admin: Cancel Reservation
  async adminCancelReservation(
    req: Request<{ reservationId:string }>,
    res: Response
  ){

    try{


      const result =
        await reservationService.adminCancelReservation(
          req.params.reservationId
        );


      return res.status(200).json({

        success:true,

        message:result.message

      });


    }catch(error:any){

      return res.status(
        error.statusCode || 400
      ).json({

        success:false,

        message:error.message

      });

    }

  }


}


export default new ReservationController();