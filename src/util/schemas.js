const Joi = require('joi');

module.exports.messageSchema = Joi.object().keys({
  table_name: Joi.string().required(),
  sequence: Joi.number().max(Number.MAX_SAFE_INTEGER).strict().required(),
  data: Joi.object().required(),
  key_names: Joi.array().items(Joi.string()).min(1).required(),
  action: Joi.string().strict().default('upsert'),
  client_id: Joi.number().strict().required()
});

module.exports.configSchema = Joi.object().keys({
  client_id: Joi.number().integer().strict().required(),
  token: Joi.string().required(),
  validate_url: Joi.string().uri().optional(),
  push_url: Joi.string().uri().required()
});
