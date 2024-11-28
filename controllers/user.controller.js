const UserModel = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const TaskModel = require("../models/task.model");

// Get User Profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await UserModel.findById(id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json(new ApiResponse(404, data, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched"));
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

// Update profile (having their role as users)
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req;
    const { userName, email, phone } = req.body;

    console.log(id);
    // Find the user
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Check if the user's role is `user`
    if (user.role !== "user") {
      return res
        .status(403)
        .json(
          new ApiResponse(403, null, "Only users can update their profile.")
        );
    }

    // Update the user's profile
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Profile updated successfully"));
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

// Update the status of assigned tasks by the user
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req;
    const { taskId, status } = req.body;

    // Validate status
    const validStatus = ["pending", "in-progress", "completed"];
    if (!validStatus.includes(status)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid status value."));
    }

    // Find the task
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json(new ApiResponse(404, null, "Task not found"));
    }

    // Check if the task is assigned to the current user
    if (!task.assignedTo || task.assignedTo.toString() !== id) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            "You are not authorized to update this task."
          )
        );
    }

    // Update the task status
    task.status = status;
    await task.save();

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task status updated successfully"));
  } catch (error) {
    console.error("Error updating task status:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken: existingRefreshToken } = req.body;

    // Validate if the refresh token is provided
    if (!existingRefreshToken) {
      return res
        .status(401)
        .json(new ApiResponse(401, data, "Refresh token required"));
    }

    // Decode and verify the existing refresh token
    let decoded;
    try {
      decoded = jwt.verify(
        existingRefreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      return res
        .status(403)
        .json(new ApiResponse(403, data, "Invalid or expired refresh token"));
    }

    // Find the user associated with the refresh token
    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== existingRefreshToken) {
      return res
        .status(403)
        .json(new ApiResponse(403, data, "Invalid refresh token"));
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken },
          "Invalid refresh token"
        )
      );
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateTaskStatus,
  refreshAccessToken,
};
