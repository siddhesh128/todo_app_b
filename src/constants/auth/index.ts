export const LOGIN_MESSAGES = {
    CREDENTIALS_NEEDED: "Credentials Needed",
    USER_NOT_FOUND: "User not found",
    INVALID_CREDENTIALS: "Invalid credentials",
    SERVER_ERROR: "Server error",
    LOGIN_SUCCESS: "Login Successful",
  };
  export const REGISTER_MESSAGES = {
    CREDENTIALS_NEEDED: "Credentials Needed",
    USER_ALREADY_EXISTS: "User already exists",
    ERROR_REGISTERING_USER: "Error registering user",
};


  export const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
  