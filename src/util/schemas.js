const Joi = require('joi');

module.exports.validMessage = (message) => {
  const schema = Joi.object().keys({
    table_name: Joi.string(),
    sequence: Joi.number().max(Number.MAX_SAFE_INTEGER).strict(),
    data: Joi.object(),
    key_names: Joi.array().items(Joi.string()).min(1),
    action: Joi.string().strict().default('upsert')
  });
  const { value, error } = schema.validate(message, { abortEarly: false });
  return (error !== undefined)
    ? error.details.map((e) => e.message).join(', ')
    : value;
};

module.exports.configSchema = Joi.object().keys({
  client_id: Joi.number().integer().strict(),
  token: Joi.string(),
  validate_url: Joi.string().uri().optional(),
  push_url: Joi.string().uri()
});
