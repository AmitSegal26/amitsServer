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
        `${chalk.bold.hex(colorOfLoggerTopics)("\nTIME:")} ${chalk.bgBlue.bold(
          ":time"
        )} ${chalk.bold.hex(colorOfLoggerTopics)(
          "\nREST:"
        )}:method, ${chalk.bold.hex(colorOfLoggerTopics)(
          "\nURL:"
        )}:url,${chalk.bold.hex(colorOfLoggerTopics)(
          "\nHTTP:"
        )}:http-version, ${chalk.bold.hex(colorOfLoggerTopics)(
          "\nSTATUS:"
        )} :status, ${chalk.bold.hex(colorOfLoggerTopics)(
          "\nREQUESTED WITH:"
        )}:user-agent, ${chalk.bold.hex(colorOfLoggerTopics)(
          "\nRESPOND TIME:"
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
