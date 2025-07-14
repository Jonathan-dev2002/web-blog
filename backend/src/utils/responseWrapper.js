const successResponse = (h, data, message = "Success", statusCode = 200) => {
  const response = {
    success: true,
    message: message,
    data: data,
  };
  return h.response(response).code(statusCode);
};


const errorResponse = (h, message = "An error occurred", statusCode = 500) => {
  const response = {
    success: false,
    message: message,
    data: null,
  };
  return h.response(response).code(statusCode);
};

module.exports = {
  successResponse,
  errorResponse,
};