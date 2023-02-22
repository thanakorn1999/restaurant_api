const user = require("../controller/user/login.js");
const err = require("../controller/public/err");

module.exports = function (app) {
  app.get("/API/test", user.testGet, err);
  app.get("/API/generate", user.generate, err);
  app.post("/API/register", user.register, err);
  app.post("/API/login", user.login, err);
};
