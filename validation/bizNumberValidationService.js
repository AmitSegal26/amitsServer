const config = require("config");
const bizNumberValidationMongo = require("./joi/bizNumberValidation");

const validatorOption = config.get("validatorOption");

const bizNumberValidation = (bizNumber) => {
  if (validatorOption === "Joi") {
    return bizNumberValidationMongo.validateBizNumberSchema({ bizNumber });
  }
  throw new Error("validator undefined");
};

module.exports = {
  bizNumberValidation,
};
