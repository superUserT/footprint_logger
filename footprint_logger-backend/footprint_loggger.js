const pino = require("pino");
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "Logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const authLogFile = path.join(logsDir, "authRoutesLogs.json");
const footprintLogFile = path.join(logsDir, "footprintLoggerRoutesLogs.json");
const generalLogFile = path.join(logsDir, "generalLogs.json");

const createLogger = (logFile) => {
  return pino({
    level: process.env.NODE_ENV !== "production" ? "debug" : "info",
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
};

module.exports = {
  authLogger: createLogger(authLogFile),
  footprintLogger: createLogger(footprintLogFile),
  generalLogger: createLogger(generalLogFile),
  logger: createLogger(generalLogFile),
};
