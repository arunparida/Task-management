const jwt = require('jsonwebtoken');

// Function to generate access token
const generateAccessToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
};

module.exports = {
    generateAccessToken
}