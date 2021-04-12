const expect = require('chai').expect;
const { describe } = require('node-tdd');
const prepare = require('../../src/util/prepare');

describe('Testing message prepare', {
  timestamp: 1618261498805
}, () => {
  it('Testing message with error', () => {
    expect(() => prepare({
      table_name: 25,
      sequence: '',
      data: {},
      key_names: ['a'],
      action: 'append',
      other: 5
    })).to.throw([
      '"table_name" must be a string.',
      '"sequence" must be a number.',
      '"client_id" is required.',
      '"other" is not allowed'
    ].join(' '));
  });

  it('Testing message with sucess', () => {
    const result = prepare({
      table_name: 'table_name',
      data: {},
      key_names: ['a'],
      action: 'append',
      client_id: 12345
    });
    expect(result).to.deep.equal({
      table_name: 'table_name',
      data: {},
      key_names: ['a'],
      action: 'append',
      sequence: 1618261498805000,
      client_id: 12345
    });
  });

  it('Testing message with sequence sucess', () => {
    const result = prepare({
      table_name: 'table_name',
      data: {},
      key_names: ['a'],
      action: 'append',
      client_id: 12345,
      sequence: 1234567890
    });
    expect(result).to.deep.equal({
      table_name: 'table_name',
      data: {},
      key_names: ['a'],
      action: 'append',
      sequence: 1234567890,
      client_id: 12345
    });
  });
});
