const pino = require("pino");
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "Logs");
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error("Cannot create logs directory, using console only:", error);
}

const logFile = path.join(logsDir, "logs.json");

let logger;

try {
  if (process.env.NODE_ENV !== "production") {
    logger = pino({
      level: "debug",
      transport: {
        targets: [
          {
            target: "pino-pretty",
            level: "debug",
            options: {},
          },
          {
            target: "pino/file",
            level: "debug",
            options: {
              destination: logFile,
              mkdir: true,
            },
          },
        ],
      },
    });
  } else {
    logger = pino({
      level: "info",
      transport: {
        targets: [
          {
            target: "pino/file",
            level: "info",
            options: {
              destination: logFile,
              mkdir: true,
            },
          },
        ],
      },
    });
  }
} catch (error) {
  console.error("Logger initialization failed, using basic logger:", error);
  logger = pino();
}

module.exports = { logger };
