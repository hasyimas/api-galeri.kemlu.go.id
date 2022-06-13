const db = require('../models')
const Galleries = db.galleries

exports.countImages = async (req, res) => {
   
    try {
        const count = await Galleries.count({ fileType: "image" });
        res.status(200).send({ count })
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}
exports.countVideos = async (req, res) => {
    try {
        const count = await Galleries.count({ fileType: "video" });
        res.status(200).send({ count })
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}
exports.countAudios = async (req, res) => {
    try {
        const { fileType } = await req.query
        const count = await Galleries.count({ fileType: "audio" });
        res.status(200).send({ count })
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}