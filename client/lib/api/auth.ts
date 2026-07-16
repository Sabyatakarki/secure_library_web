import { getUserData } from "../cookies";

export async function getCurrentUser() {
  return await getUserData();
}

export async function isStudent() {
  const user = await getUserData();
  return user?.role === "Student";
}

export async function isLibrarian() {
  const user = await getUserData();
  return user?.role === "Librarian";
}