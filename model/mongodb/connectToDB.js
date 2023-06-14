const config = require("config");
const mongoose = require("mongoose");
const chalk = require("chalk");

//*aesthetics of console ()
console.log("");
console.log(
  `connection DB MongoDB => ${
    config.get("dbConfig.url") &&
    config.get("dbConfig.url").startsWith("mongodb+srv://")
      ? chalk.hex("#fff700").underline.bold("ATLAS Enviroment")
      : chalk.green.underline.bold("LOCAL Enviroment")
  }`
);

const connectToDB = () => {
  return mongoose.connect(config.get("dbConfig.url"));
};

module.exports = connectToDB;
