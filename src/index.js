const Joi = require('joi');
const axios = require('axios').default;
const push = require('./core/push');
const prepare = require('./util/prepare');
const { configSchema } = require('./util/schemas');

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
    add: (messages) => (Array.isArray(messages) ? messages : [messages])
      .forEach((message) => {
        batch.push(prepare({
          ...message,
          client_id: clientId
        }));
      }),
    flush: async (dryrun = false) => push(dryrun, batch, axiosClient, config)
  };
};
