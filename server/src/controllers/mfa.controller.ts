import { Request, Response, NextFunction } from "express";
import mfaService from "../services/mfa.service";
import { VerifyMfaDto } from "../dtos/mfa.dtos";

class MfaController {

  // Generate MFA Secret + QR Code
  async generateMfa(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mfaService.generateMfa(
        req.user!._id.toString()
      );

      return res.status(200).json({
        success: true,
        message: "MFA secret generated successfully.",
        data: result,
      });

    } catch (error) {
      next(error);
    }
  }


  // Verify MFA Setup
  async verifyMfa(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token }: VerifyMfaDto = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "MFA token is required.",
        });
      }

      const result = await mfaService.verifyMfa(
        req.user!._id.toString(),
        token
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });

    } catch (error) {
      next(error);
    }
  }


  // Disable MFA
  async disableMfa(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mfaService.disableMfa(
        req.user!._id.toString()
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });

    } catch (error) {
      next(error);
    }
  }


  // Verify MFA During Login
  async verifyLoginMfa(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, token } = req.body;

      if (!email || !token) {
        return res.status(400).json({
          success: false,
          message: "Email and MFA token are required.",
        });
      }

      const result = await mfaService.verifyLoginMfa(
        email,
        token
      );

      return res.status(200).json({
        success: true,
        message: "MFA verification successful.",
        data: result,
      });

    } catch (error) {
      next(error);
    }
  }
}

export default new MfaController();