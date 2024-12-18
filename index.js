const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT;
const DATABASE_URL = process.env.MONGO_DB_URI;

// import routes
const AuthRoutes = require("./routes/auth.routes");
const AdminRoutes = require("./routes/admin.routes");
const UserRoutes = require("./routes/user.routes");
const TaskRoutes = require("./routes/task.routes");
const connectDB = require("./configs/db.config");
const createAdmin = require("./seeders/admin.seeder");

// Middleware for enabling CORS
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/task", TaskRoutes);

// start the server
const startServer = async () => {
  try {
    // Database connection
    await connectDB(DATABASE_URL);

    // Seed admin user
    await createAdmin();

    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
