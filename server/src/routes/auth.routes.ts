import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

// Authentication Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;