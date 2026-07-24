import User, { IUser } from "../models/user.model";
import { RegisterUserDto, UpdateUserDto } from "../dtos/user.dtos";

class UserRepository {
  // Create User
  async createUser(userData: RegisterUserDto): Promise<IUser> {
    return await User.create(userData);
  }

  // Find User By Email
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  // Find User By Student ID
  async findByStudentId(studentId: string): Promise<IUser | null> {
    return await User.findOne({ studentId });
  }

  // Find User By ID
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  // Get All Users
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().select("-password");
  }

  // Update User
  async updateUser(
    id: string,
    userData: UpdateUserDto
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  // Update Profile Picture
  async updateProfilePicture(
    id: string,
    profilePicture: string
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { profilePicture },
      { new: true }
    ).select("-password");
  }

  // Update Password
  async updatePassword(
  id: string,
  password: string
): Promise<IUser | null> {
  return await User.findByIdAndUpdate(
    id,
    {
      password,
      passwordUpdatedAt: new Date(),
    },
    { new: true }
  );
}

  // Update Last Login
  async updateLastLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, {
      lastLogin: new Date(),
      failedLoginAttempts: 0,
    });
  }

  // Increment Failed Login Attempts
  async incrementFailedLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, {
      $inc: { failedLoginAttempts: 1 },
    });
  }

  // Lock Account
  async lockAccount(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, {
      accountLocked: true,
    });
  }

  // Delete User
  async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();