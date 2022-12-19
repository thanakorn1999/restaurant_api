module.exports = (success, message, message_th, message_en) => {
  return {
    success: success ? "success" : "error",
    message: message,
    message_th: message_th,
    message_en: message_en,
  };
};
