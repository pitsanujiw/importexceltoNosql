require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const dal = require("./connect/connection");
const fetchdata = require("./route/xlsx");
var fs = require("fs");

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
/**
 *
 */
const dbName = process.env.DBS_NAME;
const host = process.env.DB_HOSTNAME;
const api = process.env.API_HOSTNAME;
const ports = process.env.API_PORT;
var server;
/**  */
app.get("/writefiles", (req, res) => {
  var path = "/public",
    buffer = new Buffer("some content\n");
  fs.open(__dirname + path, "w", function(err, fd) {
    if (err) {
      throw "error opening file: " + err;
    }

    fs.write(fd, buffer, 0, buffer.length, null, function(err) {
      if (err) throw "error writing file: " + err;
      fs.close(fd, function() {
        console.log("file written");
        res.send("file written");
      });
    });
  });
});
app.get("/getdata", (req, res) => {
  fetchdata
    .querydata(req, res)
    .then(res => {
      console.log("ok ⚽️ ");
    })
    .catch(err => {
      console.log(err);
    });
});
app.post("/upload", (req, res) => {
  fetchdata
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
        console.log(`Server running at ${hostname}:${port}  👍 😇`);
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
  console.log("Closing server now... 🙅");
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
