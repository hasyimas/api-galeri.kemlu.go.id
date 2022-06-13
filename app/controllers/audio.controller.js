const db = require('../models')
const Galleries = db.galleries
const exiftool = require("exiftool-vendored").exiftool;

exports.getAll = async (req, res) => {
    try {
        const galleries = await Galleries.find({ fileType: "audio" })
        res.status(200).send({ galleries })
    } catch (error) {
        res.status(400).send(error.message)
    }

}

exports.findById = async (req, res) => {
    try {
        let id = req.params.id
        let gallery = await Galleries.findById(id).exec();
        res.send({ data: await gallery });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error while retrieving audio"
        });
    }
}

exports.create = async (req, res) => {

    try {
        let { files } = await req;
        let { title, description, keywords, year } = await req.body
        let galleryArray = []

        for (var i = 0; i < files.length; i++) {
            let exifData = await exiftool.read(await files[i].path)

            let titleXif = title ? title : exifData.Title
            let descriptionXif = description ? description : exifData.Description
            let keywordsXif = keywords ? keywords.split(',') : exifData.Keywords
            let yearXif = year ? year : exifData.Year

            let pxToCm = 0.0264583333
            galleryArray.push(new Galleries({
                title: titleXif,
                description: descriptionXif,
                keywords: keywordsXif,
                year: yearXif,
                fileSize: exifData.FileSize,
                imageWidthInCm: parseFloat(pxToCm * exifData.ImageWidth).toFixed(2),
                imageHeightInCm: parseFloat(pxToCm * exifData.ImageHeight).toFixed(2),
                imageWidth: exifData.ImageWidth,
                imageHeight: exifData.ImageHeight,
                xResolution: exifData.XResolution,
                yResolution: exifData.YResolution,
                fileTypeExtension: exifData.FileTypeExtension,
                fileType: 'audio',
                sourceFile: `${files[i].filename}`,
            }))
        }
        Galleries.insertMany(galleryArray).then((result) => {
            // let jumlahData = [{ 'jumlahData': result.length }]
            // jumlahData.push(result)
            res.status(200).send({
                message: "Audio has been Inserted"
            });
        }).catch((err) => {
            res.status(400).send({
                message: err.message || "Some error while create audio"
            })
        });

    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while create audio"
        })
    }
}


exports.update = async (req, res) => {
    try {
        let id = await req.params.id
        let { files } = await req;
        let { title, description, keywords, year } = await req.body


        const galleries = await Galleries.findById(id);
        galleries.title = title;
        galleries.description = description;
        galleries.keywords = keywords ? keywords.split(',') : keywords;
        galleries.year = year;
        galleries.fileType = 'audio';
        if (files.length > 0) {
            galleries.sourceFile = `${files[0].filename}`;
        }
        await galleries.save();

        res.status(200).send({
            message: "audio has been Updated"
        });

    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving audio"
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const id = req.body.id;
        const gallery = await Galleries.findById(id);
        gallery.remove();
        res.status(200).send({
            message: "audio has been Deleted"
        });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving audio"
        });
    }
}


