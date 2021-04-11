const expect = require('chai').expect;
const { describe } = require('node-tdd');
const { configSchema, validMessage } = require('../../src/util/schemas');

describe('Testing Schemas', () => {
  it('Testing validMessage error', () => {
    const result = validMessage({
      table_name: 25,
      sequence: '',
      data: {},
      key_names: ['a'],
      action: 'append',
      other: 5
    });
    expect(result).to.equal([
      '"table_name" must be a string',
      '"sequence" must be a number',
      '"other" is not allowed'
    ].join(', '));
  });

  it('Testing validMessage ok', () => {
    const result = validMessage({
      table_name: 'table',
      data: {
        key_for_upsert: 1,
        n: 2
      },
      key_names: ['key_for_upsert']
    }, { abortEarly: false });
    expect(result).to.deep.equal({
      table_name: 'table',
      data: {
        key_for_upsert: 1,
        n: 2
      },
      key_names: ['key_for_upsert'],
      action: 'upsert'
    });
  });

  it('Testing configSchema error', () => {
    const { error } = configSchema.validate({
      client_id: '25',
      token: '',
      validate_url: {},
      push_url: ['a']
    }, { abortEarly: false });
    expect(error).to.contain({
      name: 'ValidationError',
      message: [
        '"client_id" must be a number.',
        '"token" is not allowed to be empty.',
        '"validate_url" must be a string.',
        '"push_url" must be a string'
      ].join(' ')
    });
  });

  it('Testing configSchema ok', () => {
    const { value, error } = configSchema.validate({
      client_id: 123456789,
      token: 'abcdefg',
      validate_url: 'https://url.com',
      push_url: 'https://url.com'
    }, { abortEarly: false });
    expect(error).to.be.an('undefined');
    expect(value).to.deep.equal({
      client_id: 123456789,
      push_url: 'https://url.com',
      token: 'abcdefg',
      validate_url: 'https://url.com'
    });
  });
});
