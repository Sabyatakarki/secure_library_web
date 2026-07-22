import { Router } from "express";
import userController from "../controllers/user.controller";
import { authorizedMiddleware } from "../middleware/auth.middlware";
import { uploads } from "../middleware/upload.middlware";
import {loginLimiter,registerLimiter,forgotPasswordLimiter,} from "../middleware/rateLimit.middlware";

const router = Router();

router.post(
  "/register",
  registerLimiter,
  userController.register
);
router.post(
  "/login",
  loginLimiter,
  userController.login
);
router.post("/logout", authorizedMiddleware, userController.logout);


router.get("/profile", authorizedMiddleware, userController.getProfile);

router.put("/profile", authorizedMiddleware, userController.updateProfile);

router.post("/forgot-password", userController.sendResetPasswordEmail);

router.post("/reset-password/:token", userController.resetPassword);


router.put(
  "/profile-picture",
  authorizedMiddleware,
  uploads.profile.single("profilePicture"),
  userController.uploadProfilePicture
);

router.put(
  "/change-password",
  authorizedMiddleware,
  userController.changePassword
);

router.get("/", authorizedMiddleware, userController.getAllUsers);

router.delete(
  "/delete-account",
  authorizedMiddleware,
  userController.deleteAccount);

export default router;