const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().hex().required().length(24),
});

const validateLoginSchema = (userInput) => loginSchema.validateAsync(userInput);

module.exports = {
  validateLoginSchema,
};
