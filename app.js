const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const initialData = require("./initialData/initialData");
const chalk = require("chalk");

const apiRouter = require("./routes/api");

const app = express();

app.use(cors());

logger.token("time", () => {
  let a = new Date();
  return a.toTimeString().split(" ")[0];
});

let colorOfLoggerTopics = "#f46ff0";
app.use(
  logger(
    chalk.hex("#83c129").bold.underline("Request DETAILS:") +
      " " +
      chalk.hex("#f3ff09")(
        `${chalk.bgBlue.bold(":time")} ${chalk.hex(colorOfLoggerTopics)(
          "REST:"
        )}:method, ${chalk.hex(colorOfLoggerTopics)("URL:")}:url,${chalk.hex(
          colorOfLoggerTopics
        )("HTTP:")}:http-version, ${chalk.hex(colorOfLoggerTopics)(
          "STATUS:"
        )} :status, ${chalk.hex(colorOfLoggerTopics)(
          "REQUESTED WITH:"
        )}:user-agent, ${chalk.hex(colorOfLoggerTopics)(
          "RESPOND TIME:"
        )}:response-time ms`
      )
  )
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
initialData();
app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).json({ err: "page not found" });
});

module.exports = app;
