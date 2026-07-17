"use server";

import { register, login, whoami, updateProfile,resetPassword, requestPasswordReset  } from "../auth";
import axios from "axios";
import { setUserData, clearAuthCookies } from "../cookies";

const API_URL = "http://localhost:5050/api/users";

// Register
export async function registerUser(userData: any) {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      userData,
      {
        withCredentials: true,
      }
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Registration failed",
    };
  }
}

// Login
export async function loginUser(loginData: any) {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      loginData,
      {
        withCredentials: true,
      }
    );

    const user = response.data.data.user;

    await setUserData(user);

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Login failed",
    };
  }
}

// Logout
export async function logoutUser() {
  try {
    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error(error);
  }

  await clearAuthCookies();

  return {
    success: true,
    message: "Logged out successfully",
  };
}


export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email);
        if (response.success) {
            return {
                success: true,
                message: 'Password reset email sent successfully'
            }
        }
        return { success: false, message: response.message || 'Request password reset failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Request password reset action failed' }
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword);
        if (response.success) {
            return {
                success: true,
                message: 'Password has been reset successfully'
            }
        }
        return { success: false, message: response.message || 'Reset password failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Reset password action failed' }
    }
};