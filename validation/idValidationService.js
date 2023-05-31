const config = require("config");
const joiIDValidation = require("./joi/idValidation");

const validatorOption = config.get("validatorOption");

const IDValidation = (id) => {
  if (validatorOption === "Joi") {
    return joiIDValidation.validateIdSchema({ id });
  }
  throw new Error("validator undefined");
};

module.exports = {
  IDValidation,
};
