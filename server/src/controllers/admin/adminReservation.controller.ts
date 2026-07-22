import { Request, Response } from "express";
import adminReservationService from "../../services/admin/adminReservation.service";
import activityLogService from "../../services/admin/activityLogs.service";

class AdminReservationController {


  // Librarian: Get All Reservations
  async getAllReservations(
    req: Request,
    res: Response
  ) {

    try {

      const reservations =
        await adminReservationService.getAllReservations();


      return res.status(200).json({

        success:true,

        message:
        "Reservations fetched successfully.",

        data:reservations

      });


    } catch(error:any){

      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:error.message

      });

    }

  }






  // Librarian: Approve Reservation
async approveReservation(
  req: Request,
  res: Response
) {

  try {

    const reservationId =
      req.params.reservationId as string;


    if (!reservationId) {

      return res.status(400).json({
        success:false,
        message:"reservationId is required"
      });

    }


    const rental =
      await adminReservationService.approveReservation(
        reservationId,
        req.user!._id.toString()
      );


    return res.status(200).json({

      success:true,

      message:
      "Reservation approved successfully.",

      data:rental

    });


  } catch(error:any) {

    return res.status(
      error.statusCode || 500
    ).json({

      success:false,

      message:error.message

    });

  }

}







  // Librarian: Cancel Reservation
  async cancelReservation(
    req:Request,
    res:Response
  ){

    try{


      const reservationId =
        req.params.reservationId as string;



      if(!reservationId){

        return res.status(400).json({

          success:false,

          message:
          "reservationId is required"

        });

      }




      const result =
        await adminReservationService.cancelReservation(
          reservationId
        );
        await activityLogService.create({
  user: req.user,
  action: "Cancelled Reservation",
  description: `Cancelled reservation ${reservationId}`,
  ipAddress: req.ip,
});



      return res.status(200).json({

        success:true,

        message:
        "Reservation cancelled successfully.",

        data:result

      });



    }catch(error:any){

      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:error.message

      });

    }

  }


}


export default new AdminReservationController();