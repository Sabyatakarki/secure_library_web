"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyKhaltiPayment } from "../../../lib/actions/payment-action";


export default function PaymentSuccessPage() {

  const searchParams = useSearchParams();

  const [message, setMessage] = useState(
    "Verifying payment..."
  );


  useEffect(() => {

    const verifyPayment = async () => {

      const pidx =
        searchParams.get("pidx");


      const purchaseOrderId =
        searchParams.get(
          "purchase_order_id"
        );


      if (!pidx || !purchaseOrderId) {

        setMessage(
          "Payment information missing."
        );

        return;
      }



      try {


        const pidx = searchParams.get("pidx");
const purchaseOrderId = searchParams.get("purchase_order_id");

if (!pidx || !purchaseOrderId) {
  setMessage("Payment verification failed.");
  return;
}

const response = await verifyKhaltiPayment(
  pidx,
  purchaseOrderId
);


        console.log(
          "Khalti Response:",
          response
        );



        if(
          response?.data?.status === "Completed"
        ){

          setMessage(
            "Payment successful! Your fine has been cleared."
          );

        }
        else{

          setMessage(
            "Payment is not completed."
          );

        }



      } catch(error){

        console.error(error);

        setMessage(
          "Payment verification failed."
        );

      }

    };


    verifyPayment();


  }, [searchParams]);



  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-50">

      <div className="bg-white rounded-2xl shadow-md p-8 text-center">

        <h1 className="text-2xl font-bold text-slate-900">
          Payment Status
        </h1>


        <p className="mt-4 text-slate-600 font-medium">
          {message}
        </p>


      </div>

    </div>

  );

}