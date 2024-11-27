const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

// Function to generate access token
const generateAccessToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
};

// Function to generate refresh token
const generateRefreshToken = async (userId) => {
    try {
        const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Find and delete any existing refresh token for the user
        await UserModel.findByIdAndUpdate(
            { _id: userId },
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )
        // Save the new refresh token in the database
        await UserModel.findByIdAndUpdate(
            { _id: userId },
            {
                $set: {
                    refreshToken: refreshToken // this removes the field from document
                }
            },
            {
                new: true
            }
        )
        return refreshToken;
    } catch (error) {
        // Handle any errors
        console.error('Error generating refresh token:', error);
        throw new Error('Unable to generate refresh token');
    }
};



module.exports = {
    generateAccessToken,
    generateRefreshToken,
}