var db = undefined;
var upload = require("../upload/upload_file");
var dbEvents = require("../connect/con").eventEmitter;
// var dbconnect = require("../connect/con");
var xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

dbEvents.on("dbInstanceChanged", dbInstance => {
  console.log("Handle dbInstanceChanged event BY UPLOAD DATABASE");
  db = dbInstance;
});

function checkDBConnection() {
  if (!db) {
    dbconnect.connect(host);
    throw new Error("DB is not connected");
  }
}

function xlsx_to_mongoDB(req, res) {
  checkDBConnection();
  return new Promise((resolve, reject) => {
    upload(req, res, err => {
      if (req.files === undefined) throw new Error("files is undefined");
      if (!err) {
        //upload files
        var myFiles;
        req.files.forEach(e => {
          var file = {
            pathFile: path.join(e.destination.split(".").pop(), e.filename)
          };
          myFiles = file;
        });
        var workbook = xlsx.readFile(path.join(myFiles.pathFile));
        var sheet_name_list = workbook.SheetNames;
        var DATA = xlsx.utils.sheet_to_json(
          workbook.Sheets[sheet_name_list[0]]
        );
        db.collection("Liverpool").insert(DATA, (err, data) => {
          if (err) throw err;
          if (data.result.n > 0) {
            res.json({
              status: true,
              message: `${data.insertedCount} Inserted `
            });
            resolve(console.log("insert complete"));
          } else {
            res.json({
              status: false,
              message: `${data.insertedCount} Inserted `
            });
            reject(console.error(`uploader error :  ${err}`));
          }
        });
      }
    });
  }).catch(err => {
    reject(console.error(`uploader error :  ${err}`));
  });
}

function querydata(req, res) {
  return new Promise((resolve, reject) => {
    db.collection("Liverpool")
      .find({})
      .toArray((err, data) => {
        if (err) throw err;
        if (data.length > 0) {
          res.json({
            message: data
          });
          resolve(data);
        } else {
          res.json({
            message: data
          });
          reject("Error find fail");
        }
      });
  });
}
module.exports = {
  xlsx_to_mongoDB,
  querydata
};
