const db = require('../models')
const Galleries = db.galleries
const path = require('path');
const sharp = require("sharp");
const exiftool = require("exiftool-vendored").exiftool;
var watermark = require('jimp-watermark');

exports.findAll = async (req, res) => {
    try {
        let { keyword, year, docType, page } = req.query
        const curPage = page || 1
        const perPage = 12

        let filter = {}
        let reqCompile = ''

        if (keyword) {
            keyword = keyword.split(',')
            let reg = ''
            await keyword.forEach(keyword => {
                reg += keyword + '|'
            });
            reqCompile = '(' + reg.substr(0, reg.length - 1) + ')'
            filter.keywords = new RegExp(reqCompile, 'i')
        }

        if (year) {
            const yearAr = year.split('-')
            filter.year = { $gte: yearAr[0], $lte: yearAr[1] }
        }

        if (docType) {
            filter.fileType = docType
        }

        const galleries = await Galleries.find(filter).skip((curPage - 1) * perPage).limit(perPage)
        const totalData = await Galleries.find(filter).limit(300).countDocuments()
        res.send({
            curPage: curPage,
            maxPage: Math.ceil(totalData / perPage),
            data: galleries,
        })

    } catch (err) {
        res.status(500).send(err.message)
    }

}

exports.getAll = async (req, res) => {
    try {
        const galleries = await Galleries.find({fileType:"audio"})
        res.status(200).send({ galleries })
    } catch (error) {
        res.status(400).send(error.message)
    }

}

exports.banner = async (req, res) => {
    await Galleries.find({ bannerStat: true })
        .then((result) => {
            res.send({ data: result });
        }).catch((err) => {
            res.status(500).send({
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
        res.status(500).send({
            message: err.message || "Some error while retrieving galleries"
        });
    }
}

exports.create = async (req, res) => {

    try {
        let { files, filename: photo } = await req;
        let { title, description, keywords, year, filetype } = await req.body
        let galleryArray = []

        for (var i = 0; i < files.length; i++) {
            let exifData = await exiftool.read(await files[i].path)

            let titleXif = title ? title : exifData.Title
            let descriptionXif = description ? description : exifData.Description
            let keywordsXif = keywords ? keywords.split(',') : exifData.Keywords
            let yearXif = year ? year : exifData.Year
            let fileTypeXif = filetype ? filetype : exifData.FileType
            let arrTypeXif = exifData.FileType.split("/")

            if (arrTypeXif[0] == "image") {
                try {
                    await sharp(files[i].path)
                        .resize(512)
                        .toFile(
                            path.join(__dirname, `../../public/uploads/thumbnail/${files[i].filename}`)
                        )

                    var options = {
                        'ratio': 0.6,// Should be less than one
                        'opacity': 0.6, //Should be less than one
                        'dstPath': `../../public/images/watermark/${files[i].filename}`
                    };
                    await watermark.addWatermark(`../../public/uploads/thumbnail/${files[i].filename}`, '../../public/uploads/images/text.png', options).then(data => {
                    }).catch(err => {
                        console.log(`failer ${files[i].filename}}`);
                    });
                } catch (error) {
                    console.log(error)
                }
            }
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
                fileType: fileTypeXif,
                sourceFile: `${files[i].filename}`,
            }))
        }
        Galleries.insertMany(galleryArray).then((result) => {
            // let jumlahData = [{ 'jumlahData': result.length }]
            // jumlahData.push(result)
            res.status(200).send({
                message: "Galleries has been Inserted"
            });
        }).catch((err) => {
            res.status(409).send({
                message: err.message || "Some error while create galleries"
            })
        });

    } catch (err) {
        res.status(409).send({
            message: err.message || "Some error while create galleries"
        })
    }
}


exports.update = async (req, res) => {
    try {
        let id = await req.params.id
        let { files } = await req;
        let { title, description, keywords, year, filetype, bannerStat } = await req.body

        if (files.length > 0) {
            updateBulk(req, res)
        } else {
            const galleries = await Galleries.findById(id);
            galleries.title = title;
            galleries.description = description;
            galleries.keywords = keywords ? keywords.split(',') : keywords;
            galleries.year = year;
            galleries.fileType = filetype;
            galleries.bannerStat = bannerStat;
            await galleries.save();

            res.status(200).send({
                message: "Galleries has been Updated"
            });
        }


    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving galleries"
        });
    }
}

exports.updateBanner = async (req, res) => {
    try {
        let id = await req.params.id
        let { bannerStat } = await req.body
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
async function updateBulk(req, res) {
    let id = await req.params.id
    let { files } = await req;
    let { title, description, keywords, year, filetype } = await req.body

    let galleryArray = []
    for (var i = 0; i < files.length; i++) {

        let exifData = await exiftool.read(await files[i].path)
        let titleXif = title ? title : exifData.Title
        let descriptionXif = description ? description : exifData.Description
        let keywordsXif = keywords ? keywords : exifData.Keywords
        let yearXif = year ? year : exifData.Year
        let fileTypeXif = filetype ? filetype : exifData.FileType
        let pxToCm = 0.0264583333
        galleryArray.push({
            $set: {
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
                fileType: fileTypeXif,
                sourceFile: `uploads/${files[i].filename}`,
            }
        })
    }
    Galleries.update({ '_id': id }, galleryArray).then((result) => {
        // let jumlahData = [{ 'jumlahData': result.length }]
        // jumlahData.push(result)

        // res.send(jumlahData)
        res.status(200).send({
            message: "Galleries has been Updated"
        });
    }).catch((err) => {
        res.status(409).send({
            message: err.message || "Some error while create galleries"
        })
    });
}

exports.delete = async (req, res) => {
    try {
        const id = req.body.id;
        const gallery = await Galleries.findById(id);
        gallery.remove();
        res.status(200).send({
            message: "galleries has been Deleted"
        });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving galleries"
        });
    }
}


