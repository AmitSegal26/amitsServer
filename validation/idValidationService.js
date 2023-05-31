const config = require("config");
const joiIDValidation = require("./joi/idValidation");

const validatorOption = config.get("validatorOption");

const IDValidation = (userInput) => {
  if (validatorOption === "Joi") {
    return joiIDValidation.validateIdSchema(userInput);
  }
  throw new Error("validator undefined");
};

module.exports = {
  IDValidation,
};
