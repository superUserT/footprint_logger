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

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
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

app.use(express.json());

const footprintLoggerRoutes = require("./routes/footprintLoggerRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

app.use("/api/auth", authRoutes);
app.use("/api/logs", footprintLoggerRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(authMessages.internalServerError);
});

app.get("/", (req, res) => {
  res.send(misc.server);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
