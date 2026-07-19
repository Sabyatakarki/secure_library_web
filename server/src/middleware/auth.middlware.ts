import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import userRepository from "../repositories/user.repository";
import { HttpError } from "../error/http-error";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1. Check Authorization Header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Check Cookie
    if (!token && req.cookies?.library_token) {
      token = req.cookies.library_token;
    }

    if (!token) {
      throw new HttpError(401, "Unauthorized. Token missing.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    if (!decoded?.id) {
      throw new HttpError(401, "Invalid token.");
    }

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new HttpError(401, "User not found.");
    }

    req.user = user;

    // Protect Admin Routes
    if (
      req.originalUrl.startsWith("/api/admin") &&
      user.role !== "Admin"
    ) {
      throw new HttpError(
        403,
        "Access denied. Admin only."
      );
    }

    next();
  } catch (error: any) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};