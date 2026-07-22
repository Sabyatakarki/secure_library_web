import { Request, Response } from "express";
import paymentService from "../services/payment.service";


class PaymentController {


  async initiatePayment(
    req: Request,
    res: Response
  ) {

    try {

      console.log("========== PAYMENT REQUEST ==========");
      console.log(req.body);


      const payment =
        await paymentService.initiatePayment(req.body);


      res.status(200).json({
        success: true,
        data: payment
      });


    } catch (error: any) {

      console.log("========== PAYMENT ERROR ==========");
      console.log(error.message);


      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }




  async verifyPayment(
    req: Request,
    res: Response
  ) {

    try {

      const {
  pidx,
  purchase_order_id,
} = req.body;

const result =
  await paymentService.verifyPayment(
    pidx,
    purchase_order_id
  );


    } catch (error: any) {

      console.log("========== VERIFY PAYMENT ERROR ==========");
      console.log(error.message);


      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }


}


export default new PaymentController();