require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const dal = require("./connect/con");
const xlsx_insert_DBS = require("./route/xlsx");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const dbName = process.env.DBS_NAME;
const host = process.env.DB_HOSTNAME;
const api = process.env.API_HOSTNAME;
const ports = process.env.API_PORT;
var server;
/**  */
app.get("/getdata", (req, res) => {
  xlsx_insert_DBS
    .querydata(req, res)
    .then(res => {
      console.log("ok");
    })
    .catch(err => {
      console.log(err);
    });
});
app.post("/upload", (req, res) => {
  xlsx_insert_DBS
    .xlsx_to_mongoDB(req, res)
    .then(result => {
      console.log("insert success!");
    })
    .catch(err => {
      console.log("insert fail");
    });
});
//**   */
app.get("/", (req, res) => {
  res.send("hello");
});
/** start services? */
function startListening() {
  dal
    .connect(host)
    .then(() => {
      server = app.listen(ports, api, () => {
        const port = server.address().port;
        const hostname = server.address().address;
        console.log(`Server running at ${hostname}:${port}`);
      });
    })
    .catch(error => {
      console.error(error);
    });
}
/**
 * @function disconnection server and mongoDB
 */
function stopListening() {
  if (!server) {
    return;
  }
  console.log("Closing server now...");
  server.close(() => {
    dal.disconnect();
    console.log("Server is closed.");
  });
}

process.on("SIGTERM", () => {
  stopListening();
});

process.on("SIGINT", () => {
  stopListening();
});
/**
 *
 */
startListening();
