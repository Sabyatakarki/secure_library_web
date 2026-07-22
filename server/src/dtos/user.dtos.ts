export interface RegisterUserDto {
  fullName: string;
  email: string;
  password: string;
  studentId: string;
  phoneNumber: string;
  department: string;
  semester: number;
  address?: string;
  profilePicture?: string;
  role?: "Student" | "Admin";
}

export interface LoginUserDto {
  email: string;
  password: string;
  ipAddress?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  phoneNumber?: string;
  department?: string;
  semester?: number;
  address?: string;
  profilePicture?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}