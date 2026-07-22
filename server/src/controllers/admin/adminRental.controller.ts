import { Request, Response } from "express";
import adminRentalService from "../../services/admin/adminRental.service";
import activityLogService from "../../services/admin/activityLogs.service";


class AdminRentalController {


  // Get All Rentals
  async getAllRentals(req: Request, res: Response) {

    try {

      const rentals =
        await adminRentalService.getAllRentals();
        


      return res.status(200).json({

        success: true,

        message: "Rentals fetched successfully.",

        data: rentals,

      });


    } catch(error:any){

      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:
        error.message ||
        "Internal Server Error"

      });

    }

  }



  // Get Rental By ID
  async getRentalById(
    req: Request,
    res: Response
  ){

    try {


      const rentalId =
      req.params.rentalId as string;


      const rental =
      await adminRentalService.getRentalById(
        rentalId
      );

      await activityLogService.create({
  user: req.user,
  action: "Returned Book",
  description: `Returned rental ${rentalId}`,
  ipAddress: req.ip,
});


      return res.status(200).json({

        success:true,

        message:
        "Rental fetched successfully.",

        data:rental

      });



    }catch(error:any){


      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:
        error.message ||
        "Internal Server Error"

      });

    }

  }





  // Return Book
  async returnBook(
    req:Request,
    res:Response
  ){

    try{


      const rentalId =
      req.params.rentalId as string;


      const rental =
      await adminRentalService.returnBook(
        rentalId
      );


      return res.status(200).json({

        success:true,

        message:
        "Book returned successfully.",

        data:rental

      });


    }catch(error:any){


      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:
        error.message ||
        "Internal Server Error"

      });


    }

  }


}


export default new AdminRentalController();