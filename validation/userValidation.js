const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.string().required(),
  role: Joi.string().valid('admin', 'user', 'chairman', 'manager').required()
});

module.exports = userSchema;
