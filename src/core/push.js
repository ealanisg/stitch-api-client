module.exports = async (dryrun, batch, axiosClient, config) => {
  if (batch.length === 0) {
    return {
      status: 400,
      message: 'Nothing to push'
    };
  }
  let result = '';
  const url = (dryrun === true)
    ? config.validate_url
    : config.push_url;
  try {
    result = await axiosClient.post(url, batch);
    batch.splice(0, batch.length);
    return result.data;
  } catch (err) {
    if (err.response !== undefined) {
      return {
        status: err.response.status,
        message: err.response.statusText,
        errors: JSON.stringify(err.response.data.errors)
      };
    }
    return {
      name: err.name,
      code: err.code,
      message: err.message
    };
  }
};
