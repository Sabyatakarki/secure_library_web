"use server";

import api from "../api/axios";
import { API } from "../api/endpoints";


export async function initiateKhaltiPayment(data:any){

try{


const response = await api.post(
API.PAYMENT.INITIATE,
data
);


return response.data;


}catch(error:any){

throw new Error(
error.response?.data?.message ||
"Khalti payment failed"
);

}

}




export async function verifyKhaltiPayment(
pidx:string
){

try{


const response =
await api.post(
API.PAYMENT.VERIFY,
{
pidx
}
);


return response.data;



}catch(error:any){

throw new Error(
"Payment verification failed"
);

}


}