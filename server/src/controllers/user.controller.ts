// import { Request, Response } from "express";
// import userService from "../services/user.service";
// import activityLogService from "../services/admin/activityLogs.service";

// class UserController {
//   // Register User
//   async register(req: Request, res: Response) {

    
//     try {
//       const result = await userService.register(req.body);

//       await activityLogService.create({
//   user: result,
//   action: "Student Registration",
//   description: `${result.fullName} registered a new account.`,
//   ipAddress: req.ip,
// });

//       return res.status(201).json({
//         success: true,
//         message: "User registered successfully.",
//         data: result,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Login User
// async login(req: Request, res: Response) {

//   console.log("CONTROLLER LOGIN HIT");

//   try {

//     const result = await userService.login(req.body);


//     // MFA required
//     if (result.requiresMfa) {

//       return res.status(200).json({
//         success: true,
//         message: "MFA verification required.",
//         data: {
//           requiresMfa: true,
//           email: result.email,
//         },
//       });

//     }


//     // Create activity log after successful login
//     await activityLogService.create({
//       user: result.user,
//       action: "User Login",
//       description: `${result.user.fullName} logged into the system.`,
//       ipAddress: req.ip,
//     });


//     res.cookie("library_token", result.token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite:
//         process.env.NODE_ENV === "production"
//           ? "strict"
//           : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });


//     return res.status(200).json({
//       success: true,
//       message: "Login successful.",
//       data: {
//         user: result.user,
//         token: result.token,
//       },
//     });


//   } catch (error: any) {

//     return res.status(error.statusCode || 400).json({
//       success: false,
//       message: error.message,
//     });

//   }
// }

//   // Get Logged-in User Profile
//   async getProfile(req: Request, res: Response) {
//     try {
//       const result = await userService.getProfile(
//         (req.user as any)._id.toString()
//       );

//       return res.status(200).json({
//         success: true,
//         message: "Profile fetched successfully.",
//         data: result,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Update Profile
//   async updateProfile(req: Request, res: Response) {
//     try {
//       const result = await userService.updateProfile(
//         (req.user as any)._id.toString(),
//         req.body
//       );

//       await activityLogService.create({
//   user: req.user,
//   action: "Profile Updated",
//   description: `${req.user?.fullName} updated their profile.`,
//   ipAddress: req.ip,
// });

//       return res.status(200).json({
//         success: true,
//         message: "Profile updated successfully.",
//         data: result,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Upload Profile Picture
//   async uploadProfilePicture(
//     req: Request & { file?: Express.Multer.File },
//     res: Response
//   ) {
//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: "Please upload a profile picture.",
//         });
//       }

//       const result = await userService.updateProfile(
//         (req.user as any)._id.toString(),
//         {
//           profilePicture: req.file.filename,
//         }
//       );

//       return res.status(200).json({
//         success: true,
//         message: "Profile picture uploaded successfully.",
//         data: result,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Change Password
//   async changePassword(req: Request, res: Response) {
//     try {
//       const { currentPassword, newPassword } = req.body;

//       const result = await userService.changePassword(
//         (req.user as any)._id.toString(),
//         currentPassword,
//         newPassword
//       );
//       await activityLogService.create({
//   user: req.user,
//   action: "Password Changed",
//   description: `${req.user?.fullName} changed their password.`,
//   ipAddress: req.ip,
// });



//       return res.status(200).json({
//         success: true,
//         message: result.message,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Get All Users
//   async getAllUsers(req: Request, res: Response) {
//     try {
//       const result = await userService.getAllUsers();

//       return res.status(200).json({
//         success: true,
//         data: result,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Delete Account
//   async deleteAccount(req: Request, res: Response) {
//     try {
//       const result = await userService.deleteAccount(
//         (req.user as any)._id.toString()
//       );

//       await activityLogService.create({
//   user: req.user,
//   action: "Account Deleted",
//   description: `${req.user?.fullName} deleted their account.`,
//   ipAddress: req.ip,
// });

//       return res.status(200).json({
//         success: true,
//         message: result.message,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }


//   // Send Reset Password Email
// async sendResetPasswordEmail(req: Request, res: Response) {
//   try {
//     const { email } = req.body;

//     const result = await userService.sendResetPasswordEmail(email);

//     return res.status(200).json({
//       success: true,
//       data: result,
//       message: "If the email is registered, a password reset link has been sent.",
//     });
//   } catch (error: any) {
//     return res.status(error.statusCode || 400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

// // Reset Password
// async resetPassword(req: Request, res: Response) {
//   try {
//     const token = Array.isArray(req.params.token)
//       ? req.params.token[0]
//       : req.params.token;
//     const { newPassword } = req.body;

//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid reset token.",
//       });
//     }

//     await userService.resetPassword(token, newPassword);

//     return res.status(200).json({
//       success: true,
//       message: "Password has been reset successfully.",
//     });
//   } catch (error: any) {
//     return res.status(error.statusCode || 400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

//   async logout(req: Request, res: Response) {
//   res.clearCookie("library_token");

//   return res.status(200).json({
//     success: true,
//     message: "Logged out successfully.",
//   });
// }

// }

// export default new UserController();




import { Request, Response } from "express";
import userService from "../services/user.service";
import activityLogService from "../services/admin/activityLogs.service";

class UserController {
  // Register User
  async register(req: Request, res: Response) {
    try {
      const result = await userService.register(req.body);

      await activityLogService.create({
        user: result,
        action: "Student Registration",
        description: `${result.fullName} registered a new account.`,
        ipAddress: req.ip,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Login User
  async login(req: Request, res: Response) {
    console.log("CONTROLLER LOGIN HIT");

    try {
      const result = await userService.login(req.body);

      // Password Expiration (90 Days) check
      if ("isPasswordExpired" in result && result.isPasswordExpired) {
        return res.status(403).json({
          success: false,
          message: "Your password has expired (older than 90 days). Please update your password to proceed.",
          data: {
            isPasswordExpired: true,
            email: result.email,
          },
        });
      }

      // MFA required
      if ("requiresMfa" in result && result.requiresMfa) {
        return res.status(200).json({
          success: true,
          message: "MFA verification required.",
          data: {
            requiresMfa: true,
            email: result.email,
          },
        });
      }

      // Create activity log after successful login
      await activityLogService.create({
        user: result.user,
        action: "User Login",
        description: `${result.user.fullName} logged into the system.`,
        ipAddress: req.ip,
      });

      res.cookie("library_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "strict"
            : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get Logged-in User Profile
  async getProfile(req: Request, res: Response) {
    try {
      const result = await userService.getProfile(
        (req.user as any)._id.toString()
      );

      return res.status(200).json({
        success: true,
        message: "Profile fetched successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update Profile
  async updateProfile(req: Request, res: Response) {
    try {
      const result = await userService.updateProfile(
        (req.user as any)._id.toString(),
        req.body
      );

      await activityLogService.create({
        user: req.user,
        action: "Profile Updated",
        description: `${req.user?.fullName} updated their profile.`,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Upload Profile Picture
  async uploadProfilePicture(
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a profile picture.",
        });
      }

      const result = await userService.updateProfile(
        (req.user as any)._id.toString(),
        {
          profilePicture: req.file.filename,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Change Password
  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;

      const result = await userService.changePassword(
        (req.user as any)._id.toString(),
        currentPassword,
        newPassword
      );

      await activityLogService.create({
        user: req.user,
        action: "Password Changed",
        description: `${req.user?.fullName} changed their password.`,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get All Users
  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await userService.getAllUsers();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete Account
  async deleteAccount(req: Request, res: Response) {
    try {
      const result = await userService.deleteAccount(
        (req.user as any)._id.toString()
      );

      await activityLogService.create({
        user: req.user,
        action: "Account Deleted",
        description: `${req.user?.fullName} deleted their account.`,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Send Reset Password Email
  async sendResetPasswordEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const result = await userService.sendResetPasswordEmail(email);

      return res.status(200).json({
        success: true,
        data: result,
        message: "If the email is registered, a password reset link has been sent.",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Reset Password
  async resetPassword(req: Request, res: Response) {
    try {
      const token = Array.isArray(req.params.token)
        ? req.params.token[0]
        : req.params.token;
      const { newPassword } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Invalid reset token.",
        });
      }

      await userService.resetPassword(token, newPassword);

      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully.",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("library_token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }
}

export default new UserController();