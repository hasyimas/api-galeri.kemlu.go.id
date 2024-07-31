const db = require('../models')
const Galleries = db.galleries
const path = require('path');
const sharp = require("sharp");


exports.getAll = async (req, res) => {
    try {
        const galleries = await Galleries.find().sort({ bannerStat: -1 })
        res.status(200).send({ galleries })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.getActive = async (req, res) => {
    await Galleries.find({ bannerStat: true })
        .then((result) => {
            res.send({ data: result });
        }).catch((err) => {
            res.status(400).send({
                message: err.message || "Some error while retrieving galleries"
            });

        });
}
exports.findById = async (req, res) => {
    try {
        let id = req.params.id
        let gallery = await Galleries.findById(id).exec();
        res.send({ data: await gallery });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving galleries"
        });
    }
}
exports.updateBanner = async (req, res) => {
    try {
        let id = await req.params.id
        let { files } = await req;
        let { bannerStat } = await req.body

        const pathBannerResolve = path.resolve(path.join(__dirname, "../../public/uploads/banner/"), files[0].filename)
        const pathResolve = path.resolve(path.join(__dirname, "../../public/uploads/banner/resize/"), files[0].filename)

        await sharp(pathBannerResolve).jpeg({ quality: 100 }).toFile(pathResolve);

        const galleries = await Galleries.findById(id);

        galleries.bannerStat = bannerStat;
        await galleries.save();

        res.status(200).send({
            message: "Galleries has been Updated"
        });

    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving galleries"
        });
    }

}
