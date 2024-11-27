const TaskModel = require("../models/task.model");
const UserModel = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");

// Update Task
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json(new ApiResponse(404, null, "Task not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { updatedTask: task }, "Task updated successfully")
      );
  } catch (error) {
    console.error("Error updating task:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await TaskModel.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json(new ApiResponse(404, null, "Task not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Task deleted successfully"));
  } catch (error) {
    console.error("Error deleting task:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { user: updatedUser }, "User updated successfully")
      );
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

// assigned task to users by manager and admin
const assignTask = async (req, res) => {
  try {
    const { id } = req;
    const { taskId, assignedTo } = req.body;

    // Find the authenticated user
    const assigningUser = await UserModel.findById(id);
    if (!assigningUser) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Assigning user not found."));
    }

    // Check if the user is a manager or admin
    if (!["manager", "admin"].includes(assigningUser.role)) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            "Only managers and admins can assign tasks."
          )
        );
    }

    // Find the user to assign the task to
    const assignee = await UserModel.findById(assignedTo);
    if (!assignee) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "User to assign task to not found."));
    }

    // If the assigning user is a manager, ensure the assignee is in their team
    if (
      assigningUser.role === "manager" &&
      assignee.managerId.toString() !== assigningUser._id.toString()
    ) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            "Managers can only assign tasks to users in their team."
          )
        );
    }

    // Find the task
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Task not found."));
    }

    // Assign the task
    task.assignedTo = assignedTo;
    await task.save();

    res
      .status(200)
      .json(new ApiResponse(200, { task: task }, "Task assigned successfully"));
  } catch (error) {
    console.error("Error assigning task:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

module.exports = {
  updateTask,
  deleteTask,
  updateUser,
  assignTask,
};
