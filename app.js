const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const initialData = require("./initialData/initialData");
const chalk = require("chalk");
const fs = require("fs");
const usersModelService = require("./model/usersService/usersService");

const apiRouter = require("./routes/api");

const app = express();

//!LOGIN-RADIUS
const session = require("express-session");

app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.get("/", function (req, res) {
  res.render("pages/auth");
});
//!

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
    writeLogs(logData, res);
    return morganData;
  })
);

//!BONUD - Log ERRORS
const logsDirectory = path.join(__dirname, "logs");

const writeLogs = (logData, res) => {
  if (res && res.statusCode >= 400) {
    const currentDate = new Date().toISOString().split("T")[0];

    fs.mkdir(logsDirectory, { recursive: true }, (err) => {
      if (err) {
        console.error("Error Adding new `logs` Folder", err);
        return;
      }
      const logFilePath = path.join(logsDirectory, `${currentDate}.log`);
      fs.appendFile(logFilePath, logData + "\n", (errSecond) => {
        if (errSecond) {
          console.error("Error writing logs:", errSecond);
        }
      });
    });
  }
};
//!
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
initialData();
app.use("/api", apiRouter);

//!PASSPORT
/*  PASSPORT SETUP  */

const passport = require("passport");
const normalizeUserFromGoogle = require("./model/mongodb/google/normalizeGoogleUser");
const CustomError = require("./utils/CustomError");
const { generateHash } = require("./utils/hash/bcrypt");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/success", async (req, res) => {
  try {
    let normalUser = normalizeUserFromGoogle.normalizeUserFromGoogle(req.user);
    let userFromDB = await usersModelService.getUserByEmail(normalUser.email);
    if (!userFromDB || userFromDB == {}) {
      normalUser.password = await generateHash(normalUser.password);
      await usersModelService.registerUser(normalUser);
    }
    res.render("pages/success", { user: normalUser });
  } catch (err) {
    res.status(400).json(err);
  }
});
app.get("/logout", (req, res) => {
  // console.log(req);
  req.logout((err) => {
    if (err) {
      // Handle any errors that occur during logout
      console.error("Logout error:", err);
      // Redirect or send an error response
      res.status(500).send("Logout failed");
      return;
    }
    // Logout successful, redirect to the home page or any other desired page
    res.redirect("/");
  });
});
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
//!

//!GOOGLE
/*  Google AUTH  */

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
  "707547587231-a541l28svkb1591rvb844162lpc3cr1s.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const PORT = 8181;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/success");
  }
);
//!
app.use((req, res, next) => {
  res.status(404).json({ err: "page not found" });
});

module.exports = app;
