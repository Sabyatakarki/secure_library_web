import { Router } from "express";
import mfaController from "../controllers/mfa.controller";
import { authorizedMiddleware } from "../middleware/auth.middlware";

const router = Router();

/**
 * Generate QR Code
 * Logged-in users only
 */
router.post(
  "/generate",
  authorizedMiddleware,
  mfaController.generateMfa
);

/**
 * Verify QR setup
 * Logged-in users only
 */
router.post(
  "/verify",
  authorizedMiddleware,
  mfaController.verifyMfa
);

/**
 * Disable MFA
 * Logged-in users only
 */
router.put(
  "/disable",
  authorizedMiddleware,
  mfaController.disableMfa
);

/**
 * Login MFA Verification
 * No JWT required because the user
 * has only completed the first step.
 */
router.post(
  "/login",
  mfaController.verifyLoginMfa
);

export default router;