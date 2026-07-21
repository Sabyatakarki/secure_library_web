import {Router} from "express";
import paymentController from "../controllers/payment.controller";
import {authorizedMiddleware} from "../middleware/auth.middlware";


const router = Router();



router.post(
"/initiate",
authorizedMiddleware,
paymentController.initiatePayment
);



router.post(
"/verify",
authorizedMiddleware,
paymentController.verifyPayment
);



export default router;