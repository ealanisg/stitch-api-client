const Joi = require('joi');
const axios = require('axios').default;
const push = require('./core/push');
const { configSchema, validMessage } = require('./util/schemas');

module.exports = (config) => {
  Joi.assert(config, configSchema);
  const batch = [];
  const clientId = config.client_id;
  const axiosClient = axios.create({
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    },
    timeout: 2500
  });
  return {
    message: (props) => {
      const message = {
        ...props,
        ...(props.sequence === undefined)
          ? { sequence: Date.now() }
          : {}
      };
      return validMessage(message);
    },
    add: (messages) => (Array.isArray(messages) ? messages : [messages])
      .forEach((message) => batch.push({
        ...message,
        client_id: Number(clientId)
      })),
    flush: async (dryrun = false) => push(dryrun, batch, axiosClient, config)
  };
};
