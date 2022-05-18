import multer from 'multer'
import fs from "fs"

// Set storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = "public/uploads/";
        fs.mkdirSync(path);
        cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "." + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})

var upload = multer({ storage: storage });

export default upload;