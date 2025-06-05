const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  inStock: Joi.boolean().required(),
  category: Joi.string().required(),
  supplier: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required()
});

module.exports = productSchema;
