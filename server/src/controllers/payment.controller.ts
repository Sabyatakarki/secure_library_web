import {Request,Response} from "express";
import paymentService from "../services/payment.service";


class PaymentController{


async initiatePayment(
req:Request,
res:Response
){

try{


const payment =
await paymentService.initiatePayment(req.body);


res.status(200).json({
success:true,
data:payment
});


}catch(error:any){

res.status(500).json({
success:false,
message:error.message
});


}

}



async verifyPayment(
req:Request,
res:Response
){

try{


const {pidx}=req.body;


const result =
await paymentService.verifyPayment(pidx);



res.status(200).json({
success:true,
data:result
});



}catch(error:any){

res.status(500).json({
success:false,
message:error.message
});


}


}


}


export default new PaymentController();