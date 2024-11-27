const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { validateSignup, validateLogin } = require("../validations/auth.validation");
const ApiResponse = require("../utils/ApiResponse");

// New user signup based on role
const signup = async (req, res) => {
  try {
    // Validate the signup data
    const validationErrors = validateSignup(req.body);
    if (validationErrors) {
      return res.status(400).json(new ApiResponse(400, validationErrors, "Validation failed"));
    }

    const { userName, email, password, role, managerId } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, null, "Email is already registered"))
    }

    // Ensure managerId is not provided if the role is 'manager'
    if (role === "manager" && managerId) {
      return res.status(400).json(new ApiResponse(400, null, "ManagerId should not be provided if the role is 'manager'."))
    }

    // Ensure managerId is required for 'user' role
    if (role === "user" && !managerId) {
      return res.status(400).json(new ApiResponse(400, null, "ManagerId is required for users with the 'user' role."))
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      userName,
      email,
      password: hashedPassword,
      role,
      managerId: role === "user" ? managerId : null,
    });

    return res.status(201).json(new ApiResponse(201, user, "User registered successfully."))
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

// Login function
const login = async (req, res) => {
  try {
    // Validate the login data
    const validationErrors = validateLogin(req.body);
    if (validationErrors) {
      return res.status(400).json(new ApiResponse(400, validationErrors, "Validation failed"));
    }

    const { userName, password } = req.body;

    // Find user by username
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Check if the user is active
    if (!user.isActive) {
      return res.status(403).json(new ApiResponse(403, null, "Account is inactive. Please contact the admin."));
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(new ApiResponse(401, null, "Incorrect password"));
    }

    // Generate token with userId and roleId
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const loggedInUser = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      managerId: user.managerId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }
    return res.status(200).json(new ApiResponse(200, loggedInUser, "Login successful"));

  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

const logout = async (req, res) => {
  const userId = req.id;

  await UserModel.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1 // this removes the field from document
      }
    },
    {
      new: true
    }
  )

  return res.status(200).json(new ApiResponse(200, {}, "User logged Out"))
};

module.exports = {
  signup,
  login,
  logout,
};
