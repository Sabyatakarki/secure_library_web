import { Request, Response } from "express";
import rentalService from "../services/rental.service";

class RentalController {


  // Student: View My Rentals
  async getMyRentals(
    req: Request,
    res: Response
  ){

    try{

      const result =
        await rentalService.getMyRentals(
          req.user!._id.toString()
        );


      return res.status(200).json({

        success:true,

        data:result

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





  // Student: Return Book
  async returnBook(
    req:Request<{rentalId:string}>,
    res:Response
  ){

    try{


      const result =
        await rentalService.returnBook(
          req.params.rentalId
        );



      return res.status(200).json({

        success:true,

        message:
        result.message

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


export default new RentalController();