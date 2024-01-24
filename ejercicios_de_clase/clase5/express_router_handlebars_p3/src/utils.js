
// ----- CONFIGURAMOS MULTER ----- 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, res, cb){  // cb = callback
    cb(null, path.join(`${__dirname}/public/uploads/`))    
    },
    filename: function (req, file, cb){
        console.log('file:', file);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const uploader = multer({
    storage,
    onError: function (err, next){
        console.log("Error: " + err)
        next();
    },
})

module.exports = {
    uploader,
}

