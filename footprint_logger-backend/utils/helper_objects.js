const authMessages = {
  emailIdExists: "Email id already exists",
  resistrationSuccess: "User registered successfully",
  internalServerError: "Internal server error",
  passMismatch: "Passwords do not match",
  loginSuccess: "User logged in successfully",
  userNotFound: "User not found",
  updateApiError: "Validation errors in update request",
  emailNotInHeader: "Email not found in the request headers",
  userUpdateSuccess: "User updated successfully",
};

const errorMessages = {
  cannotConnectToDB: "Cannot connect to database",
  notAdmin: "You are not an admin",
};

module.exports = { authMessages, errorMessages };
