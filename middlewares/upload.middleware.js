import multer from 'multer'

// Set storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "." + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})

var upload = multer({ storage: storage });

export default upload;