"use server";

import { cookies } from "next/headers";

// Save User Data
export const setUserData = async (userData: any) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "user_data",
    value: JSON.stringify(userData),
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

// Get User Data
export const getUserData = async () => {
  const cookieStore = await cookies();

  const data = cookieStore.get("user_data")?.value;

  return data ? JSON.parse(data) : null;
};

// Clear User Data
export const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("user_data");
};