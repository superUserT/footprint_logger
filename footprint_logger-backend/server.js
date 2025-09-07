const express = require("express");
const { connectDB } = require("./config/mongoDbConfig.js");
const { User, Log } = require("./models/database.js");
const cors = require("cors");
const { logger } = require("./footprint_loggger.js");
const pinoHttp = require("pino-http");
const {
  errorMessages,
  authMessages,
  misc,
} = require("./utils/helper_objects.js");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB()
  .then(() => {
    logger.info("Connected to DB");
  })
  .catch((error) => console.error("Failed to connect to DB", error));

// CORS configuration - Allow requests from multiple origins
const allowedOrigins = [
  "http://localhost:5173", // React/Vite default port
  "http://localhost:3001", // Your backend port
  process.env.FRONTEND_URL, // Environment variable if set
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(pinoHttp({ pinoLogger: logger }));

// Route files
const footprintLoggerRoutes = require("./routes/footprintLoggerRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
// const queryRoutes = require("./routes/queryRoutes.js");

// Use Routes - Make sure auth routes are mounted correctly
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(authMessages.internalServerError);
});

app.get("/", (req, res) => {
  res.send(misc.server);
});

app.get("/testdb", async (req, res) => {
  try {
    // Test creating a user
    const testUser = new User({
      username: "testuser",
      email: "test@example.com",
      password: "testpass123",
    });

    await testUser.save();

    // Test creating a log
    const testLog = new Log({
      id: 1,
      logId: 1,
      date: new Date(),
      activity: "Walking",
      co2Saved: 2.5,
    });

    await testLog.save();

    res.json({ message: "Database connection and models working!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
