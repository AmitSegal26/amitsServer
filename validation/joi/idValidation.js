const Joi = require("joi");

const loginSchema = Joi.object({
  id: Joi.string().hex().required().length(24),
});

const validateIdSchema = (userInput) => loginSchema.validateAsync(userInput);

module.exports = {
  validateIdSchema,
};
