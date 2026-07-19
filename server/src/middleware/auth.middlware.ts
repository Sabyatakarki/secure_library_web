import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import userRepository from "../repositories/user.repository";
import { HttpError } from "../error/http-error";
import { JWT_SECRET } from "../config";

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

    // Authorization Header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Cookie
    if (!token && req.cookies?.library_token) {
      token = req.cookies.library_token;
    }

    if (!token) {
      throw new HttpError(
        401,
        "Unauthorized. Token missing."
      );
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as { id: string };

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new HttpError(
        401,
        "User not found."
      );
    }

    req.user = user;

    // Admin protection
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