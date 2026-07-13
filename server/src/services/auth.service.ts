class AuthService {
  // Register User
  async register(userData: any) {
    return {
      message: "User registered successfully.",
      user: userData,
    };
  }

  // Login User
  async login(loginData: any) {
    return {
      message: "Login successful.",
      user: loginData,
    };
  }

  // Logout User
  async logout() {
    return {
      message: "Logout successful.",
    };
  }
}

export default new AuthService();