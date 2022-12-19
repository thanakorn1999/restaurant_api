require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./route/index");
const myConnection = require("express-myconnection");

const PORT = process.env.SERVER_PORT;

const mysql = require("mysql");
const config = require("./config");

app.use(cors());

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(myConnection(mysql, config.dbOptions, "pool"));
app.use(express.static("public"));

routes(app);

app.listen(PORT, () => {
  console.log("ready server on PORT : " + PORT);
});
