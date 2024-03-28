// Middleware to log user requests and used winston library here.

import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

const loggerMiddleware = async (req, res, next) => {
  try {
    // Log the request body along with timestamp.
    if (!req.url.includes("users")) {
      const logData = `Request Url: ${req.url} - Request Body: ${JSON.stringify(
        req.body
      )}`;
      logger.info(logData);
    }
    // Call next middleware in the request here.
    next();
  } catch (error) {
    logger.error(`Error in loggerMiddleware: ${error.message}`);
    next(error);
  }
};

export default loggerMiddleware;
