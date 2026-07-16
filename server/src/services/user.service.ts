import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {RegisterUserDto,LoginUserDto,} from "../dtos/user.dtos";
import userRepository from "../repositories/user.repository";
import { JWT_SECRET } from "../config";
import { CLIENT_URL } from "../config";
import { HttpError } from "../error/http-error";
import { sendEmail } from "../config/email";

class UserService {
  // Register User
  async register(data: RegisterUserDto) {
    const existingEmail = await userRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new HttpError(400, "Email already exists");
    }

    const existingStudent = await userRepository.findByStudentId(
      data.studentId
    );

    if (existingStudent) {
      throw new HttpError(400, "Student ID already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.createUser({
      ...data,
      password: hashedPassword,
      role: data.role || "Student",
    });

    const userData = user.toObject();
    delete (userData as any).password;

    return userData;
  }

  // Login User
  async login(data: LoginUserDto) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!passwordMatch) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const userData = user.toObject();
    delete (userData as any).password;

    return {
      token,
      user: userData,
    };
  }

  // Get Profile
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const userData = user.toObject();
    delete (userData as any).password;

    return userData;
  }

  // Update Profile
  async updateProfile(userId: string, data: any) {
    const user = await userRepository.updateUser(userId, data);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return user;
  }

  // Change Password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      throw new HttpError(400, "Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.updatePassword(userId, hashedPassword);

    return {
      message: "Password changed successfully",
    };
  }

  // Get All Users
  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  // Delete Account
  async deleteAccount(userId: string) {
    const user = await userRepository.deleteUser(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return {
      message: "Account deleted successfully",
    };
  }
  async sendResetPasswordEmail(email: string) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return null;
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;

  await sendEmail(
    user.email,
    "Reset Your Password",
    `
      <h2>Password Reset Request</h2>

      <p>Hello ${user.fullName},</p>

      <p>You requested to reset your password.</p>

      <p>
        <a href="${resetLink}">
          Click here to reset your password
        </a>
      </p>

      <p>This link expires in 15 minutes.</p>

      <p>If you didn't request this, you can ignore this email.</p>
    `
  );

  return true;
}
async resetPassword(token: string, newPassword: string) {
  let decoded: any;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new HttpError(400, "Invalid or expired reset token");
  }

  const user = await userRepository.findById(decoded.id);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(
    user._id.toString(),
    hashedPassword
  );
}
}

export default new UserService();