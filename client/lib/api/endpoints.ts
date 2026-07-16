export const API = {
  AUTH: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",

    WHOAMI: "/users/profile",
    UPDATEPROFILE: "/users/profile",

    CHANGE_PASSWORD: "/users/change-password",

    REQUEST_PASSWORD_RESET: "/users/forgot-password",

    RESET_PASSWORD: (token: string) =>
      `/users/reset-password/${token}`,
  },

  USER: {
    PROFILE_PICTURE: "/users/profile-picture",
    DELETE_ACCOUNT: "/users/delete-account",
  },

  BOOK: {
    GET_ALL: "/books",
    GET_BY_ID: (id: string) => `/books/${id}`,
    SEARCH: "/books/search",
  },

  RESERVATION: {
    CREATE: "/reservations",
    GET_ALL: "/reservations",
    CANCEL: (id: string) => `/reservations/${id}`,
  },

  RENTAL: {
    BORROW: "/rentals",
    MY_RENTALS: "/rentals/my",
    RETURN_BOOK: (id: string) => `/rentals/return/${id}`,
  },

  LIBRARIAN: {
    DASHBOARD: "/librarian/dashboard",
    STUDENTS: "/librarian/students",
    BOOKS: "/librarian/books",
  },
};