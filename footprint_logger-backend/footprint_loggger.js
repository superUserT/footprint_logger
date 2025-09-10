const pino = require("pino");
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "Logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, "logs.json");

let logger;

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
          options: { destination: logFile },
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
          options: { destination: logFile },
        },
      ],
    },
  });
}

module.exports = { logger };
