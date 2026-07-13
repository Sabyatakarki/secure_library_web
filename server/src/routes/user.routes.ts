import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

// User Profile Routes
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
// Profile Picture
router.post("/profile-picture", userController.uploadProfilePicture);
router.delete("/profile-picture", userController.deleteProfilePicture);
// Password
router.put("/change-password", userController.changePassword);
// Export User Data
router.get("/export", userController.exportUserData);
// Account
router.delete("/delete-account", userController.deleteAccount);

export default router;