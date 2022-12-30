const user = require("../controller/user/login.js");
const err = require("../controller/public/err");

module.exports = function (app) {
  app.get("/API/test", user.testGet, err);
  app.get("/API/generate", user.generate, err);
};
