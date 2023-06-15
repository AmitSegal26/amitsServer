const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const initialData = require("./initialData/initialData");
const chalk = require("chalk");
const fs = require("fs");

const apiRouter = require("./routes/api");

const app = express();

//*Hello Checker, enter the url of your needed website to check the server's CORS
let URLForTheCheckerOfTheProject = "";
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://localhost:8181",
      URLForTheCheckerOfTheProject,
    ],
    optionsSuccessStatus: 200,
  })
);

logger.token("time", () => {
  let a = new Date();
  return a.toTimeString().split(" ")[0];
});

let colorOfLoggerTopics = "#f46ff0";
app.use(
  logger((tokens, req, res) => {
    const morganLoggerTokens = {
      time: tokens.time(req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      httpVersion: tokens["http-version"](req, res),
      status: tokens.status(req, res),
      userAgent: tokens["user-agent"](req, res),
      respondTime: tokens["response-time"](req, res),
    };
    let logData = "";
    const morganData =
      chalk.hex("#83c129").bold.underline("Request DETAILS:") +
      " " +
      chalk.hex("#f3ff09")(
        `${chalk.bold.hex(colorOfLoggerTopics)("\nTIME:")} ${chalk.bgBlue.bold(
          morganLoggerTokens.time
        )} ${chalk.bold.hex(colorOfLoggerTopics)("\nREST:")}${
          morganLoggerTokens.method
        }, ${chalk.bold.hex(colorOfLoggerTopics)("\nURL:")}${
          morganLoggerTokens.url
        },${chalk.bold.hex(colorOfLoggerTopics)("\nHTTP:")}${
          morganLoggerTokens.httpVersion
        }, ${chalk.bold.hex(colorOfLoggerTopics)("\nSTATUS:")} ${
          morganLoggerTokens.status >= 400
            ? chalk.red(morganLoggerTokens.status)
            : chalk.green(morganLoggerTokens.status)
        }, ${chalk.bold.hex(colorOfLoggerTopics)("\nREQUESTED WITH:")}${
          morganLoggerTokens.userAgent
        }, ${chalk.bold.hex(colorOfLoggerTopics)("\nRESPOND TIME:")}${
          morganLoggerTokens.respondTime
        } ms`
      );
    for (let morganToken of Object.keys(morganLoggerTokens)) {
      logData += morganLoggerTokens[morganToken] + " ";
    }
    if (res.statusCode >= 400) {
      writeLogs(logData);
    }
    return morganData;
  })
);

const logsDirectory = path.join(__dirname, "logs");

function writeLogs(logData) {
  const currentDate = new Date().toISOString().split("T")[0];
  const logFilePath = path.join(logsDirectory, `${currentDate}.log`);
  fs.appendFile(logFilePath, logData, (err) => {
    if (err) {
      console.error("Error writing logs:", err);
    }
  });
}

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
