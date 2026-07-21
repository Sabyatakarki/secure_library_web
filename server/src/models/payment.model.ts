import { Schema, model, Document, Types } from "mongoose";


export interface IPayment extends Document {

  user: Types.ObjectId;

  rental: Types.ObjectId;

  amount: number;

  pidx: string;

  transactionId: string;

  status: "Completed" | "Failed";

  createdAt: Date;

  updatedAt: Date;
}



const PaymentSchema = new Schema<IPayment>(
{

user:{
 type:Schema.Types.ObjectId,
 ref:"User",
 required:true
},


rental:{
 type:Schema.Types.ObjectId,
 ref:"Rental",
 required:true
},


amount:{
 type:Number,
 required:true
},


pidx:{
 type:String,
 required:true,
 unique:true
},


transactionId:{
 type:String,
 required:true
},


status:{
 type:String,
 enum:["Completed","Failed"],
 default:"Completed"
}


},
{
timestamps:true
}
);



export default model<IPayment>(
"Payment",
PaymentSchema
);