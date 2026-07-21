import axios from "axios";


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

console.log("KHALTI STATUS:",
error.response?.status);

console.log("KHALTI DATA:",
error.response?.data);

console.log("KHALTI MESSAGE:",
error.message);


throw new Error(
error.response?.data?.detail ||
"Khalti payment initiation failed"
);

}

  }



  async verifyPayment(pidx:string){

    try{

      const response = await axios.post(
        `${process.env.KHALTI_BASE_URL}/epayment/lookup/`,
        {
          pidx
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

      throw new Error(
        error.response?.data?.detail ||
        "Payment verification failed"
      );

    }

  }

}


export default new PaymentService();