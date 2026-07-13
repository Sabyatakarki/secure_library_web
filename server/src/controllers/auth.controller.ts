import { Request, Response } from "express";

class AuthController {
  // Register User
  async register(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: req.body,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // Login User
  async login(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({
        success: true,
        message: "Login successful.",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // Logout User
  async logout(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({
        success: true,
        message: "Logout successful.",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

export default new AuthController();