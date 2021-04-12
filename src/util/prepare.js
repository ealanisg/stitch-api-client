const { messageSchema } = require('./schemas');

module.exports = (message) => {
  const { error, value } = messageSchema.validate({
    ...message,
    ...(message.sequence === undefined)
      ? { sequence: Date.now() }
      : {}
  }, { abortEarly: false });
  if (error !== undefined) {
    throw error;
  }
  return value;
};
