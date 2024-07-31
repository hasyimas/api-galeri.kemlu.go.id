// Set Storage
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, './public/uploads');
    // },
    filename: function (req, file, cb) {

        var rpl1 = file.originalname.replace(/[^\w\s] /gi, '')
        var rpl2 = rpl1.replace(/\s+/gi, '-')
        cb(null, rpl2);
    },
    destination: async (req, file, cb) => {
        const { flag } = req.body
        if (flag == "sourceFileBanner") {
            const pathBannerResolve = path.resolve(path.join(__dirname, "../../public/uploads/banner/"), file.originalname)
            const pathResolve = path.resolve(path.join(__dirname, "../../public/uploads/banner/resize/"), file.originalname)

            if (fs.existsSync(pathBannerResolve)) {
                fs.unlinkSync(pathBannerResolve)
            }
            if (fs.existsSync(pathResolve)) {
                fs.unlinkSync(pathResolve)
            }

            cb(null, path.join(__dirname, "../../public/uploads/banner/"))


        } else if (flag == "thumbnail") {
            cb(null, path.join(__dirname, "../../public/uploads/thumbnail/"))
        } else if (flag == "watermark") {
            cb(null, path.join(__dirname, "../../public/uploads/watermark/"))
        } else {


            cb(null, path.join(__dirname, "../../public/uploads/origin/"))
        }
    }
})

//Filter the image type
const imageFileFilter = (req, file, cb) => {
    const filePath = path.resolve(path.join(__dirname, "../../public/uploads/origin/"), file.originalname)
    console.log(filePath);

    fs.exists(filePath, function (exists) {
        console.log(exists)
        if (exists) {
            req.fileValidationError = "Forbidden extension";
            return cb(null, null, req.fileValidationError);
        } else {
            return
        }
    });
    cb(null, true)
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter })
module.exports = upload