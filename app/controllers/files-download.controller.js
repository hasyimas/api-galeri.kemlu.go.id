const db = require('../models')
const mongoosexx = require('mongoose');
const filesDownload = db.filesDownload
const galleries = db.galleries



exports.getAll = async (req, res) => {
    try {
        const reslt = await filesDownload.find()
        res.status(200).send({ reslt })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.getPaging = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const offset = limit * page;

    let filter = {}

    const totalRows = await filesDownload.find(filter).countDocuments()
    const totalPage = Math.ceil(totalRows / limit);
    const reslt = await filesDownload.find(filter).skip(offset).sort('-year').limit(limit)
    res.json({
        result: reslt,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
}

exports.chart = async (req, res) => {

    const reslt = await filesDownload.aggregate([{
        $group: {
            _id: "$files_id",
            count: {
                $sum: 1
            }
        }
    }, {
        $project: {
            _id: 0,
            files_id: "$_id",
            totaldownload: "$count"
        }
    },
    {
        $lookup: {
            from: "galleries",
            localField: "files_id",
            foreignField: "_id",
            as: "detail_galeri"
        }
    }])

    var label = [];
    var datax = [];
    var colors = [];
    var maxLength = 15;

    await reslt.forEach(async (v, i) => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        colors.push('#' + randomColor)
        var result = v.detail_galeri[0].title.substring(0, maxLength) + '...';
        label.push(result);
        datax.push(v.totaldownload);


    })
    let data = await chartView(label, datax, colors)

    res.status(200).send({ data })
}

async function chartView(label, datax, colors) {

    return {
        title: "File Download",
        subtitle: "Jumlah Download Per File",
        data: {
            labels: label,
            datasets: [
                {
                    label: 'Jumlah Download',
                    data: datax,
                    backgroundColor: colors,
                    borderWidth: 1,
                }
            ]
        }
    }

}

exports.findById = async (req, res) => {
    try {
        let username = req.params.username
        let reslt = await filesDownload.findById(username).exec();
        res.send({ data: await reslt });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving galleries"
        });
    }
}

exports.create = async (req, res) => {
    try {
        let { files_id, files_type, username } = await req.body
        let filesDownloadsData = []
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        const id = mongoosexx.Types.ObjectId(files_id)
        console.log(id)
        filesDownloadsData.push(new filesDownload({
            files_id: id,
            files_type: files_type,
            username: username,
            lastDownloadAt: [year, month, day].join('-')
        }))
        filesDownload.insertMany(filesDownloadsData).then((result) => {
            res.status(200).send({
                message: "Photo has been Inserted"
            });
        }).catch((err) => {
            res.status(400).send({
                message: err.message || "Some error while create Photo"
            })
        });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while create Photo"
        })
    }
}