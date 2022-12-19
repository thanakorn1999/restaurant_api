const user = require("./user");
// const main = require('./main');
// const agent = require('./agent');
// const guest = require('./guest');

// const upload = require('../controller/public/upload');

module.exports = function (app) {
  user(app);
  //     main(app);
  //     agent(app);
  //     guest(app);

  //     app.post("/API/upload/:path", upload.upload);
  //     app.get("/API/image/:main/:path/:key", upload.getImage);
};
