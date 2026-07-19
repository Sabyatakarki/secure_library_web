import axios from "../lib/api/axios";
import { API } from "../lib/api/endpoints";

// Register
export const register = async (registerData: any) => {
  try {
    const response = await axios.post(
      API.AUTH.REGISTER,
      registerData
    );

    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Registration failed."
    );
  }
};

// Login
export const login = async (loginData: any) => {
  try {
    const response = await axios.post(
      API.AUTH.LOGIN,
      loginData
    );

    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Login failed."
    );
  }
};

// Verify Login MFA
export const verifyLoginMfa = async (
  email: string,
  token: string
) => {
  try {
    const response = await axios.post(
      "/mfa/login",
      {
        email,
        token,
      }
    );

    return response.data;

  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "MFA verification failed."
    );
  }
};

// Get Logged-in User
export const whoami = async () => {
  try {
    const response = await axios.get(
      API.AUTH.WHOAMI
    );

    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user."
    );
  }
};

// Update Profile
export const updateProfile = async (updateData: any) => {
  try {
    const response = await axios.put(
      API.AUTH.UPDATEPROFILE,
      updateData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to update profile."
    );
  }
};

// Change Password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await axios.put(
      API.AUTH.CHANGE_PASSWORD,
      {
        currentPassword,
        newPassword,
      }
    );

    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to change password."
    );
  }
};

// Request Password Reset
export const requestPasswordReset = async (
  email: string
) => {
  try {
    const response = await axios.post(
      API.AUTH.REQUEST_PASSWORD_RESET,
      {
        email,
      }
    );

    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to request password reset."
    );
  }
};

// Reset Password
export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  try {
    const response = await axios.post(
      API.AUTH.RESET_PASSWORD(token),
      {
        newPassword,
      }
    );

    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to reset password."
    );
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await axios.post(
      API.AUTH.LOGOUT
    );

    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Logout failed."
    );
  }
};