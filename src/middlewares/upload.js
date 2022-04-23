const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + '_' + file.originalname;
    cb(null, fileName)
  }
});

const upload = multer({ storage: storage });

module.exports = upload.array('files');