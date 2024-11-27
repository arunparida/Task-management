const UserModel = require("../models/user.model");
const bcrypt = require('bcrypt');

// Admin details
const createAdminDetails = async () => {
    const adminEmail = "arunp@yopmail.com";
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    return {
        userName: "arunp678",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
    };
};

// Static method to seed an admin user if it doesn't exist
async function createAdmin() {
    try {
        const adminEmail = "arunp@yopmail.com";
        const adminExists = await UserModel.findOne({
            email: adminEmail,
            role: "admin",
        });

        if (!adminExists) {
            const adminDetails = await createAdminDetails();
            const admin = new UserModel(adminDetails);

            await admin.save();
            console.log('Admin created successfully.');
        } else {
            console.log('Admin Arun.');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}


module.exports = createAdmin;