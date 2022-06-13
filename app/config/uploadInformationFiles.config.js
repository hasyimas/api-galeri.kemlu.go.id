// Set Storage
const multer = require('multer')
var path = require('path');
const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, './public/uploads');
    // },
    filename: function (req, file, cb) {

        var rpl1 = file.originalname.replace(/[^\w\s] /gi, '')
        var rpl2 = rpl1.replace(/\s+/gi, '-')
        cb(null, rpl2);
    },
    destination: (req, file, cb) => {
        const { flag } = req.body
        const type = file.mimetype
        cb(null, path.join(__dirname, "../../public/uploads/info-file/"))


    },

})
const upload = multer({ storage })
module.exports = upload