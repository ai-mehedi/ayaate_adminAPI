// utils/responseHelper.js
function sendResponse(res, statusCode, status, message, data = null) {
  return res.status(statusCode).json({
    code: statusCode, 
    status,
    message,
    data,
  });
}

module.exports = sendResponse;
