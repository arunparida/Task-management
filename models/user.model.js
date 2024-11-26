const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      required: true,
      default: "user",
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Static method to seed an admin user if it doesn't exist
userSchema.statics.seedAdmin = async function () {
  try {
    const adminEmail = "arunp@yopmail.com";
    const existingAdmin = await this.findOne({
      email: adminEmail,
      role: "admin",
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      const adminDetails = {
        userName: "arunp678",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      };
      const newAdmin = new this(adminDetails);
      await newAdmin.save();
      console.log("Admin user seeded successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
