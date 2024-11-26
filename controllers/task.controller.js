const UserModel = require('../models/user.model');
const TaskModel = require('../models/task.model');

const createTask = async (req, res) => {
    try {
        // Get the user's ID from the middleware
        const userId = req.id;

        // Retrieve user details from the database to check the role
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if the user is an 'admin' or 'manager'
        if (user.role !== 'admin' && user.role !== 'manager') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to create tasks'
            });
        }

        // Extract the necessary fields from the request body
        const { title, description, priority, status, dueDate } = req.body;

        // Validate required fields
        if (!title || !description || !priority || !status) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, priority, and status are required'
            });
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
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task: newTask,
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get All Tasks with Filters
const getAllTasks = async (req, res) => {
    try {
        const { status, priority } = req.query;

        // Build the query object based on filters
        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        // Find tasks based on filters
        const tasks = await TaskModel.find(query)
            .populate('createdBy', 'userName email') // Populate createdBy field
            .sort({ createdAt: -1 }); // Sort tasks by newest first

        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

module.exports = {
    createTask,
    getAllTasks
};