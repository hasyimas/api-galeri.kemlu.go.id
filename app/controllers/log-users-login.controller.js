const db = require('../models')
const logUsersLogin = db.logUsersLogin



exports.getAll = async (req, res) => {
    try {
        const reslt = await logUsersLogin.find()
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

    const totalRows = await logUsersLogin.find(filter).countDocuments()
    const totalPage = Math.ceil(totalRows / limit);
    const reslt = await logUsersLogin.find(filter).skip(offset).sort('-year').limit(limit)
    res.json({
        result: reslt,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
}

exports.findById = async (req, res) => {
    try {
        let username = req.params.username
        let reslt = await logUsersLogin.findById(username).exec();
        res.send({ data: await reslt });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving galleries"
        });
    }
}

exports.create = async (req, res) => {
    try {
        let { username, password } = await req.body
        let logUsersData = []
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
        logUsersData.push(new logUsersLogin({
            username: username,
            password: password,
            lastActiveAt: [year, month, day].join('-')
        }))
        logUsersLogin.insertMany(logUsersData).then((result) => {
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