import { Request, Response, NextFunction } from "express";
import {
  RegisterUserDto,
  UpdateUserDto,
} from "../../dtos/user.dtos";

import { AdminUserService } from "../../services/admin/adminUser.service";


const adminUserService = new AdminUserService();


export class AdminUserController {


  // Create User
  async createUser(
    req: Request & { file?: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) {

    try {

      const userData: RegisterUserDto = {
        ...req.body,
      };


      if (req.file) {
        userData.profilePicture =
          req.file.filename;
      }


      const newUser =
        await adminUserService.createUser(
          userData
        );


      return res.status(201).json({

        success: true,

        message: "User created successfully",

        data: newUser,

      });


    } catch (error: any) {

      return res.status(
        error.statusCode || 500
      ).json({

        success: false,

        message:
          error.message ||
          "Internal Server Error",

      });

    }
  }





  // Get All Users
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {


      const {
        page,
        size,
        search
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

        message:
          "Users retrieved successfully",

        data: result.users,

        pagination:
          result.pagination,

      });



    } catch(error:any){


      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:
          error.message ||
          "Internal Server Error",

      });

    }

  }





  // Get Single User
  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {


      const user =
        await adminUserService.getUserById(
          req.params.id as string
        );



      return res.status(200).json({

        success:true,

        message:
          "User retrieved successfully",

        data:user,

      });



    }catch(error:any){


      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:
          error.message ||
          "Internal Server Error",

      });

    }

  }





  // Update User
  async updateUser(
    req: Request & { file?: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) {

    try {


      const userData: UpdateUserDto = {
        ...req.body,
      };



      if(req.file){

        userData.profilePicture =
          req.file.filename;

      }



      const updatedUser =
        await adminUserService.updateUser(
          req.params.id as string,
          userData
        );



      return res.status(200).json({

        success:true,

        message:
          "User updated successfully",

        data:updatedUser,

      });



    }catch(error:any){


      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:
          error.message ||
          "Internal Server Error",

      });

    }

  }





  // Delete User
  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {


      await adminUserService.deleteUser(
        req.params.id as string
      );



      return res.status(200).json({

        success:true,

        message:
          "User deleted successfully",

      });



    }catch(error:any){


      return res.status(
        error.statusCode || 500
      ).json({

        success:false,

        message:
          error.message ||
          "Internal Server Error",

      });

    }

  }


}