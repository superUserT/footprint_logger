require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/mongoDbConfig.js");
const { User, Log } = require("./models/database.js");
const cors = require("cors");
const pinoLogger = require("./footprint_loggger.js");
const pinoHttp = require("pino-http");
const {
  errorMessages,
  authMessages,
  misc,
} = require("./utils/helper_objects.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB()
  .then(() => {
    pinoLogger.info("Connected to DB");
  })
  .catch((error) => console.error("Failed to connect to DB", error));

// Middleware
app.use(express.json());
app.use(pinoHttp({ pinoLogger }));

// Route files
const footprintLoggerRoutes = require("./routes/footprintLoggerRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
// const queryRoutes = require("./routes/queryRoutes.js");

// Use Routes : to change routes
// app.use("/api/gifts", giftRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/search", searchRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(authMessages.internalServerError);
});

app.get("/", (req, res) => {
  res.send(misc.server);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
