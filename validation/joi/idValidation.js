const Joi = require("joi");

const idValidateSchema = Joi.object({
  id: Joi.string().hex().required().length(24),
});

const validateIdSchema = (userInput) =>
  idValidateSchema.validateAsync(userInput);

module.exports = {
  validateIdSchema,
};
