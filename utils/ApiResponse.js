// Exclusively developed by Tribune Digitalabs for Highland foundation
// - who reserves all rights over the use and distribution of its own intellectual property rights globally©️

class ApiResponse {
    constructor(statusCode, payload, message) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode >= 200 && statusCode < 300;

        if (this.success) {
            this.data = payload;
            this.error = null;
        } else {
            this.error = payload;
            this.data = null;
        }
    }
}

module.exports = ApiResponse;