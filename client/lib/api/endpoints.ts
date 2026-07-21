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


  MFA: {
    GENERATE: "/mfa/generate",
    VERIFY: "/mfa/verify",
    DISABLE: "/mfa/disable",
    LOGIN_VERIFY: "/mfa/login",
  },


  USER: {
    PROFILE_PICTURE: "/users/profile-picture",
    DELETE_ACCOUNT: "/users/delete-account",
  },


  BOOK: {
    GET_ALL: "/books",
    GET_BY_ID: (id: string) =>
      `/books/${id}`,
    SEARCH: "/books/search",
  },


  RESERVATION: {
    CREATE: "/reservations",
    MY_RESERVATIONS: "/reservations/my",
    CANCEL: (id: string) =>
      `/reservations/${id}`,
  },


  RENTAL: {
    BORROW: "/rentals",
    MY_RENTALS: "/rentals/my",
    RETURN_BOOK: (id: string) =>
      `/rentals/return/${id}`,
  },


  ADMIN: {
    USERS: {

      CREATE: "/admin/users",

      GET_ALL: "/admin/users",

      GET_BY_ID: (id:string) =>
        `/admin/users/${id}`,

      UPDATE: (id:string) =>
        `/admin/users/${id}`,

      DELETE: (id:string) =>
        `/admin/users/${id}`,
    }
  },


  PAYMENT: {

    INITIATE: "/payment/initiate",

    VERIFY: "/payment/verify",

  }


};