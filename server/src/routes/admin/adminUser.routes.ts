import { Router } from "express";
import { authorizedMiddleware } from "../../middleware/auth.middlware";
import { AdminUserController } from "../../controllers/admin/adminUser.controller";
import { uploads } from "../../middleware/upload.middlware";


const router = Router();

const adminUserController = new AdminUserController();


// Authentication + Librarian authorization
router.use(authorizedMiddleware);


// Create user
router.post(
    "/",
    uploads.profile.single("image"),
    adminUserController.createUser
);


// Get all users
router.get(
    "/",
    adminUserController.getAllUsers
);


// Get single user
router.get(
    "/:id",
    adminUserController.getUserById
);


// Update user
router.put(
    "/:id",
    uploads.profile.single("image"),
    adminUserController.updateUser
);


// Delete user
router.delete(
    "/:id",
    adminUserController.deleteUser
);


export default router;