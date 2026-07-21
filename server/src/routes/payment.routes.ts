import {Router} from "express";
import paymentController from "../controllers/payment.controller";
import {authorizedMiddleware} from "../middleware/auth.middlware";


const router = Router();



router.post(
"/initiate",
paymentController.initiatePayment
);



router.post(
"/verify",
paymentController.verifyPayment
);



export default router;