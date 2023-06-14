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
app.use(
  logger(
    chalk.hex("#83c129").bold.underline("Request DETAILS:") +
      " " +
      chalk.hex("#f3ff09")(
        '[:date[clf]] "REST: :method URL: :url HTTP/:http-version" status::status, :res[content-length], ":user-agent"'
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
