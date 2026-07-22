import { Request, Response, NextFunction } from "express";
import {
  RegisterUserDto,
  UpdateUserDto,
} from "../../dtos/user.dtos";

import { AdminUserService } from "../../services/admin/adminUser.service";
import activityLogService from "../../services/admin/activityLogs.service";

const adminUserService = new AdminUserService();

export class AdminUserController {

  // Create User
  async createUser(
    req: Request & {
      user?: any;
      file?: Express.Multer.File;
    },
    res: Response,
    next: NextFunction
  ) {
    try {

      const userData: RegisterUserDto = {
        ...req.body,
      };

      if (req.file) {
        userData.profilePicture = req.file.filename;
      }

      const newUser =
        await adminUserService.createUser(userData);

      await activityLogService.create({
        user: req.user,
        action: "Created User",
        description: `Created user ${newUser.fullName}`,
        ipAddress: req.ip,
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });

    } catch (error: any) {

      return res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      });

    }
  }

  // Get All Users
  async getAllUsers(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) {
    try {

      const {
        page,
        size,
        search,
      } = req.query as {
        page?: string;
        size?: string;
        search?: string;
      };

      const result =
        await adminUserService.getAllUsers(
          page,
          size,
          search
        );

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.users,
        pagination: result.pagination,
      });

    } catch (error: any) {

      return res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      });

    }
  }

  // Get Single User
  async getUserById(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) {
    try {

      const user =
        await adminUserService.getUserById(
          req.params.id as string
        );

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });

    } catch (error: any) {

      return res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      });

    }
  }

  // Update User
  async updateUser(
    req: Request & {
      user?: any;
      file?: Express.Multer.File;
    },
    res: Response,
    next: NextFunction
  ) {
    try {

      const userData: UpdateUserDto = {
        ...req.body,
      };

      if (req.file) {
        userData.profilePicture = req.file.filename;
      }

      const updatedUser =
        await adminUserService.updateUser(
          req.params.id as string,
          userData
        );

      await activityLogService.create({
        user: req.user,
        action: "Updated User",
        description: `Updated user ${updatedUser.fullName}`,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });

    } catch (error: any) {

      return res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      });

    }
  }

  // Delete User
  async deleteUser(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) {
    try {

      const user =
        await adminUserService.getUserById(
          req.params.id as string
        );

      await adminUserService.deleteUser(
        req.params.id as string
      );

      await activityLogService.create({
        user: req.user,
        action: "Deleted User",
        description: `Deleted user ${user.fullName}`,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });

    } catch (error: any) {

      return res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      });

    }
  }
}