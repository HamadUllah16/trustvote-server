const multer = require('multer');
const fs = require('fs');

const path = './uploads'

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log('FileName: ', file.originalname)

        // checking if directory exists
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }

        callback(null, path);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname + '-' + Date.now())
    }

})

module.exports = multer({ storage });