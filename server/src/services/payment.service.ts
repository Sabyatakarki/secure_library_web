import axios from "axios";
import Payment from "../models/payment.model";
import Rental from "../models/rental.model";


class PaymentService {


  async initiatePayment(data:any){

    try{


      const response = await axios.post(

        `${process.env.KHALTI_BASE_URL}/epayment/initiate/`,

        {
          return_url:data.return_url,

          website_url:data.website_url,

          amount:data.amount * 100,

          purchase_order_id:data.purchase_order_id,

          purchase_order_name:data.purchase_order_name,

          customer_info:{
            name:data.name,
            email:data.email,
            phone:data.phone
          }

        },

        {
          headers:{
            Authorization:`Key ${process.env.KHALTI_SECRET_KEY}`,

            "Content-Type":"application/json"
          }
        }

      );


      return response.data;


    }catch(error:any){


      console.log(
        "KHALTI ERROR:",
        error.response?.data
      );


      throw new Error(
        error.response?.data?.detail ||
        "Khalti payment initiation failed"
      );


    }

  }





  async verifyPayment(
  pidx: string,
  purchaseOrderId: string
) {
  try {

    console.log("========== VERIFY START ==========");
    console.log("PIDX:", pidx);
    console.log("Purchase Order:", purchaseOrderId);

    const response = await axios.post(
      `${process.env.KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const khaltiData = response.data;

    console.log("========== KHALTI RESPONSE ==========");
    console.log(JSON.stringify(khaltiData, null, 2));

    if (khaltiData.status === "Completed") {

      const rentalId = purchaseOrderId.replace("FINE-", "");

      console.log("Rental ID:", rentalId);

      const rental = await Rental.findById(rentalId);

      console.log("Rental Found:", rental);

      if (rental) {

        rental.fineAmount = khaltiData.total_amount / 100;
        rental.finePaid = true;

        await rental.save();

        console.log("Rental Updated");

        console.log("Saving Payment...");

        await Payment.create({
          user: rental.user,
          rental: rental._id,
          amount: khaltiData.total_amount / 100,
          pidx: khaltiData.pidx,
          transactionId: khaltiData.transaction_id,
          status: "Completed",
        });

        console.log("Payment Saved");
      }
    }

    return khaltiData;

  } catch (error: any) {

    console.log("========== FULL ERROR ==========");
    console.error(error);

    throw error;
  }
}


}



export default new PaymentService();