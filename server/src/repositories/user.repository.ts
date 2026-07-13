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
    return await User.find();
  }

  // Update User
  async updateUser(
    id: string,
    userData: UpdateUserDto
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    });
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
    );
  }

  // Update Password
  async updatePassword(
    id: string,
    password: string
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { password },
      { new: true }
    );
  }

  // Delete User
  async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();