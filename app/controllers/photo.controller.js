const db = require('../models')
const Galleries = db.galleries
const path = require('path');
const sharp = require("sharp");
const exiftool = require("exiftool-vendored").exiftool;
const watermark = require('jimp-watermark');


exports.getAll = async (req, res) => {
    try {
        const galleries = await Galleries.find({ fileType: "image" }).sort('-year')
        res.status(200).send({ galleries })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.getPaging = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const offset = limit * page;
    let { docType, keyword, year, month } = req.query

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
        var firstDay = Date.parse('' + year + '/' + month + '/1');
        var lastDay = Date.parse('' + year + '/' + month + '/31');
        filter.createdAt = { $gte: firstDay, $lte: lastDay }
    }

    if (docType) {
        filter.fileType = docType
    }
    const totalRows = await Galleries.find(filter).countDocuments()
    const totalPage = Math.ceil(totalRows / limit);
    const galleries = await Galleries.find(filter).skip(offset).limit(limit)
    res.json({
        result: galleries,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
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

exports.create = async (req, res) => {
    try {
        let { files } = await req;
        let { title, description, keywords, year } = await req.body
        let galleryArray = []
        if (req.fileValidationError) {
            res.status(500).send({
                message: "Photo Existed"
            });
        } else {
            for (var i = 0; i < files.length; i++) {
                let exifData = await exiftool.read(await files[i].path)
                let keyword = keywords ? keywords.split(',') : keywords;
                try {
                    await sharp(files[i].path)
                        .resize(512)
                        .toFile(
                            path.join(__dirname, `../../public/uploads/thumbnail/${files[i].filename}`)
                        )

                    var options = {
                        'ratio': 0.6,// Should be less than one
                        'opacity': 0.6, //Should be less than one
                        'dstPath': path.join(__dirname, `../../public/uploads/watermark/${files[i].filename}`)
                    };

                    await watermark.addWatermark(path.join(__dirname, `../../public/uploads/thumbnail/${files[i].filename}`), path.join(__dirname, '../../public/uploads/images/text.png'), options)
                        .then(data => {
                        }).catch(err => {
                            console.log(`failer ${files[i].filename} ${err}`);
                        });
                } catch (error) {
                    console.log(error)
                }
                let pxToCm = 0.0264583333
                galleryArray.push(new Galleries({
                    title: title,
                    description: description,
                    keywords: keyword,
                    year: year,
                    fileSize: exifData.FileSize,
                    imageWidthInCm: parseFloat(pxToCm * exifData.ImageWidth).toFixed(2),
                    imageHeightInCm: parseFloat(pxToCm * exifData.ImageHeight).toFixed(2),
                    imageWidth: exifData.ImageWidth,
                    imageHeight: exifData.ImageHeight,
                    xResolution: exifData.XResolution,
                    yResolution: exifData.YResolution,
                    fileTypeExtension: exifData.FileTypeExtension,
                    fileType: 'image',
                    sourceFile: `${files[i].filename}`,
                    detail: exifData
                }))
            }
            Galleries.insertMany(galleryArray).then((result) => {
                // let jumlahData = [{ 'jumlahData': result.length }]
                // jumlahData.push(result)
                res.status(200).send({
                    message: "Photo has been Inserted"
                });
            }).catch((err) => {
                res.status(400).send({
                    message: err.message || "Some error while create Photo"
                })
            });
        }
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while create Photo"
        })
    }
}


exports.update = async (req, res) => {
    try {
        let id = await req.params.id
        let { files } = await req;
        let { title, description, keywords, year } = await req.body
        let exifData = ""

        const galleries = await Galleries.findById(id);
        galleries.title = title;
        galleries.description = description;
        galleries.keywords = keywords ? keywords.split(',') : keywords;
        galleries.year = year;
        galleries.fileType = 'image';

        if (files.length > 0) {
            galleries.sourceFile = `${files[0].filename}`;
            exifData = await exiftool.read(await files[0].path)
        }
        galleries.detail = exifData;
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


exports.createBulk = async (req, res) => {

    try {
        let { files } = await req;
        let { title, description, keywords, year } = await req.body
        let galleryArray = []

        const vTitle = JSON.parse(title)
        const vDescription = JSON.parse(description)
        const vKeywords = JSON.parse(keywords)
        const vYear = JSON.parse(year)
        for (var i = 0; i < files.length; i++) {
            let exifData = await exiftool.read(await files[i].path)
            let titleXif = vTitle[i] ? vTitle[i] : exifData.Title
            let descriptionXif = vDescription[i] ? vDescription[i] : exifData.Description
            let keywordsXif = vKeywords[i] ? vKeywords[i].split(',') : exifData.Keywords
            let yearXif = vYear[i] ? vYear[i] : exifData.DateTimeOriginal.year

            try {
                await sharp(files[i].path)
                    .resize(512)
                    .toFile(
                        path.join(__dirname, `../../public/uploads/thumbnail/${files[i].filename}`)
                    )

                var options = {
                    'ratio': 0.6,// Should be less than one
                    'opacity': 0.6, //Should be less than one
                    'dstPath': path.join(__dirname, `../../public/uploads/watermark/${files[i].filename}`)
                };

                await watermark.addWatermark(path.join(__dirname, `../../public/uploads/thumbnail/${files[i].filename}`), path.join(__dirname, '../../public/uploads/images/text.png'), options)
                    .then(data => {
                    }).catch(err => {
                        console.log(`failer ${files[i].filename} ${err}`);
                    });
            } catch (error) {
                console.log(error)
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
                fileType: 'image',
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