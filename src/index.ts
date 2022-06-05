import pino from "pino";
import starup from "./api/starup";

(async () => {
  let logger = pino({ level: process.env.NODE_ENV === "production" ? "warn" : "debug" });
  try {
    const { app, sequelize, logger: log } = await starup();
    logger = log;
    app.on("close", () => {
      logger.info("Closing server");
      logger.info("Closing database connection");
      sequelize.close()

    })
    app.listen(3000)
  } catch (e) {
    logger.error(e);
  }
})();