import multer from 'multer'
var upload = multer({ dest: './public/uploads' });

export default upload;