require("dotenv").config();
const multer = require("multer");
const path = require('path');
const fs = require("fs");
const Createpath = process.env.PATH_FILE;
function checkFilesDir(filePath) {
    let checkFiles = fs.existsSync(filePath);
    if (checkFiles !== true)
        fs.mkdirSync(filePath);
}


function splitFileTypeDest(file, cb) {
    checkFilesDir(Createpath);
    const folderFileType = file.mimetype.split("/").shift();
    if (folderFileType === "image") {
        const pathImage = Createpath + "/images";
        checkFilesDir(pathImage);
        const ext = path.extname(file.originalname).split(".").pop(); // get extention
        checkFilesDir(path.join(pathImage, ext))
        cb(null, path.join(pathImage, ext));

    } else if (folderFileType === "application") {
        const pathDocuments = Createpath + "/documents";
        checkFilesDir(pathDocuments);
        const ext = path.extname(file.originalname).split(".").pop();
        checkFilesDir(path.join(pathDocuments, ext));
        cb(null, path.join(pathDocuments, ext));
        ``
    } else if (folderFileType === "audio") {
        const pathAudios = Createpath + "/audios";
        checkFilesDir(pathAudios);
        const ext = path.extname(file.originalname).split(".").pop();
        checkFilesDir(path.join(pathAudios, ext));
        cb(null, path.join(pathAudios, ext));

    } else if (folderFileType === "video") {
        const pathVideos = Createpath + "/videos";
        checkFilesDir(pathVideos);
        const ext = path.extname(file.originalname).split(".").pop();
        checkFilesDir(path.join(pathVideos, ext));
        cb(null, path.join(pathVideos, ext));

    } else if (folderFileType === "text") {
        const pathTexts = Createpath + "/texts";
        checkFilesDir(pathTexts);
        const ext = path.extname(file.originalname).split(".").pop();
        checkFilesDir(path.join(pathTexts, ext));
        cb(null, path.join(pathTexts, ext));

    } else {
        throw ("Do not support mime type is " + file.mimetype);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        splitFileTypeDest(file, cb);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage
}).array("files");

module.exports = upload;