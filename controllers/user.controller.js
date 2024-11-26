const UserModel = require("../models/user.model");

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
  getUserProfile,
};
