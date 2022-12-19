const resp = require("./response");

module.exports = (error, req, res, next) => {
  console.log(error);
  res.json(resp(false, null, "ERROR : " + error.detail, null));
};
