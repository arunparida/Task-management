const UserModel = require('../models/user.model');

const checkAdmin = async (req, res, next) => {
  try {
    // Fetch the user by ID
    const user = await UserModel.findById(req.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    next(); // Proceed if the user is an admin
  } catch (error) {
    console.error('Error in checkAdmin middleware:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = checkAdmin;
