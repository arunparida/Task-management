const UserModel = require('../models/user.model');
const TaskModel = require('../models/task.model');
const ApiResponse = require('../utils/ApiResponse');

const createTask = async (req, res) => {
    try {
        // Get the user's ID from the middleware
        const userId = req.id;

        // Retrieve user details from the database to check the role
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        // Check if the user is an 'admin' or 'manager'
        if (user.role !== 'admin' && user.role !== 'manager') {
            return res.status(403).json(new ApiResponse(403, null, 'You do not have permission to create tasks'));
        }

        // Extract the necessary fields from the request body
        const { title, description, priority, status, dueDate } = req.body;

        // Validate required fields
        if (!title || !description || !priority || !status) {
            return res.status(400).json(new ApiResponse(400, null, 'Title, description, priority, and status are required'));
        }

        // Create a new task instance
        const newTask = new TaskModel({
            title,
            description,
            createdBy: userId,
            priority,
            status,
            dueDate
        });

        // Save the task to the database
        await newTask.save();

        // Respond with success
        return res.status(201).json(new ApiResponse(201, { task: newTask }, 'Task created successfully'));
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
};

// Get All Tasks with Filters
const getAllTasks = async (req, res) => {
    try {
        const { status, priority, dueDate } = req.query;

        // Build the query object based on filters
        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        // Filter tasks by dueDate if provided
        if (dueDate) {
            const [startDate, endDate] = dueDate.split(",");
            query.dueDate = {
                ...(startDate ? { $gte: new Date(startDate) } : {}),
                ...(endDate ? { $lte: new Date(endDate) } : {}),
            };
        }

        // Find tasks based on filters
        const tasks = await TaskModel.find(query)
            .populate('createdBy', 'userName email')
            .sort({ createdAt: -1 });

        return res.status(200).json(new ApiResponse(200, { tasks: tasks }, "Internal Server Error"));

    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
};

// status count of all the tasks related to their user
const getTasksData = async (req, res) => {
    try {
        const { id } = req;
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, "User not found."));
        }

        let tasks;

        // If the user is a manager, get tasks assigned to their team
        if (user.role === "manager") {
            const teamMembers = await UserModel.find({ managerId: id }).select("_id");
            const teamMemberIds = teamMembers.map((member) => member._id);

            tasks = await TaskModel.find({ assignedTo: { $in: teamMemberIds } });
        }
        // If the user is an individual user, get tasks assigned to them
        else if (user.role === "user") {
            tasks = await TaskModel.find({ assignedTo: id });
        }
        // Admins see all tasks
        else if (user.role === "admin") {
            tasks = await TaskModel.find();
        } else {
            return res.status(403).json(new ApiResponse(403, null, "Invalid role for viewing tasks."));
        }

        // Count tasks based on their status
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.status === "completed").length;
        const pendingTasks = tasks.filter((task) => task.status === "pending").length;
        const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
        const data = {
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
        };
        return res.status(200).json(new ApiResponse(200, data, "Task data fetched successfully"));
    } catch (error) {
        console.error("Error fetching task summary:", error);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
};


module.exports = {
    createTask,
    getAllTasks,
    getTasksData
};