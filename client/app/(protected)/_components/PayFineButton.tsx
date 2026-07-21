"use client";


import {initiateKhaltiPayment}
from "../../../lib/actions/payment-action";


export default function PayFineButton(){

const handlePayment = async()=>{


const payment =
await initiateKhaltiPayment({

amount:50,

purchase_order_id:
"FINE-001",

purchase_order_name:
"Library Late Fine",

return_url:
"http://localhost:3003/payment/success",

website_url:
"http://localhost:3003",

name:
"Student Name",

email:
"student@gmail.com",

phone:
"9800000000"

});



if(payment.data.payment_url){

window.location.href =
payment.data.payment_url;

}


};



return (

<button
onClick={handlePayment}
className="
bg-green-600
text-white
px-5
py-2
rounded
"
>

Pay Fine With Khalti

</button>

);


}