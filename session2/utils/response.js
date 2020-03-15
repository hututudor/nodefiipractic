const success = res => (status, data) => {
  return res.status(status).json({
    success: true,
    ...data
  });
};

const error = res => error => {
  console.error(error);
  return res.status(500).json({
    success: false,
    message: 'Something bad happened!'
  });
};

const message = res => (status, message) => {
  return res.status(status).json({
    success: false,
    message
  });
};

module.exports = {
  success,
  error,
  message
};
