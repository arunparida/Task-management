const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/generateToken");

// New user signup based on roleId
const signup = async (req, res) => {
  try {
    const { userName, email, password, role, managerId } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Validate roleId
    const validRoles = ["admin", "manager", "user"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roleId. Must be 'admin', 'manager', or 'user'.",
      });
    }

    // Ensure managerId is not provided if the role is 'manager'
    if (role === "manager" && managerId) {
      return res.status(400).json({
        success: false,
        message: "ManagerId should not be provided if the role is 'manager'.",
      });
    }

    // Ensure managerId is required for 'user' role
    if (role === "user" && !managerId) {
      return res.status(400).json({
        success: false,
        message: "ManagerId is required for users with the 'user' role.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // Create user
    await UserModel.create({
      userName,
      email,
      password: hashedPassword,
      role,
      managerId: role === "user" ? managerId : null,
    });

    return res.status(201).send({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find user by username
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate token with userId and roleId
    const token = generateAccessToken(user._id, user.roleId);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get User Profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await UserModel.findById(id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
  getUserProfile,
};
