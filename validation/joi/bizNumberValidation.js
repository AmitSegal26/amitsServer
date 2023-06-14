const joi = require("joi");

const bizNumberSchema = joi.object({
  bizNumber: joi.number().min(1000000).max(9999999).required(),
});

const validateBizNumberSchema = (userInput) =>
  bizNumberSchema.validateAsync(userInput);

module.exports = { validateBizNumberSchema };
