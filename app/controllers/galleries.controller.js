const db = require('../models')
const Galleries = db.galleries

exports.findAll = async (req, res) => {
    try {
        let { page, docType, keyword, year } = req.query
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

        const galleries = await Galleries.find(filter).skip((curPage - 1) * perPage).sort('-year').limit(perPage)
        const totalData = await Galleries.find(filter).limit(300).countDocuments()
        res.send({
            curPage: curPage,
            maxPage: Math.ceil(totalData / perPage),
            data: galleries,
        })

    } catch (err) {
        res.status(400).send(err.message)
    }

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

var filepath = './public/uploads/origin/1288-kemlu-01a.jpg'

exports.find = async (req, res) => {
    res.sendFile(filepath);
}