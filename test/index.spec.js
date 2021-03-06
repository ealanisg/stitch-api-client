const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Stitch = require('../src/index');

describe('Testing Stitch requests', {
  useNock: true,
  nockStripHeaders: true,
  timestamp: '2020-05-15T19:56:35.713Z',
  timeout: 50000
}, () => {
  let stitch = {};
  const message = {
    table_name: 'table',
    data: {
      key_for_upsert: 1,
      n: 2
    },
    key_names: ['key_for_upsert']
  };
  beforeEach(() => {
    stitch = Stitch({
      client_id: 123456,
      token: 't0k3n',
      validate_url: 'https://api.stitchdata.com/v2/import/validate',
      push_url: 'https://api.stitchdata.com/v2/import/push'
    });
  });

  it('Testing flush with empty batch', async () => {
    const result = await stitch.flush(true);
    expect(result).to.deep.equal({
      status: 400,
      message: 'Nothing to push'
    });
  });

  it('Testing flush one message batch (dryrun) only validates', async () => {
    stitch.add(message);
    const result = await stitch.flush(true);
    expect(result).to.deep.equal({
      status: 'OK',
      message: 'Batch is valid!'
    });
  });

  it('Testing unauthorized error', async () => {
    stitch.add(message);
    const result = await stitch.flush(true);
    expect(result).to.deep.equal({
      status: 401,
      message: null,
      errors: '"Not authorized."'
    });
  });

  it('Testing connection error', async () => {
    stitch.add(message);
    const result = await stitch.flush(true);
    expect(result).to.deep.equal({
      name: 'NetConnectNotAllowedError',
      code: 'ENETUNREACH',
      message: 'Nock: Disallowed net connect for "api.stitchdata.com:443/v2/import/validate"'
    });
  });

  it('Testing flush two message batch (dryrun) only validates', async () => {
    const message2 = {
      ...message,
      sequence: Date.now() + 1
    };
    stitch.add([
      message, message2
    ]);
    const result = await stitch.flush(true);
    expect(result).to.deep.equal({
      status: 'OK',
      message: 'Batch is valid!'
    });
  });

  it('Testing flush message batch push', async () => {
    stitch.add(message);
    const result = await stitch.flush();
    expect(result).to.deep.equal({
      status: 'OK',
      message: 'Batch Accepted!'
    });
  });
});
