const db = require('../models')
const logVisitorLogin = db.logVisitorLogin



exports.getAll = async (req, res) => {
    try {
        const reslt = await logVisitorLogin.find()
        res.status(200).send({ reslt })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.chart = async (req, res) => {

    var d = new Date(),
        month = d.getMonth(),
        day = d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }


    const reslt = await logVisitorLogin.aggregate([{
        $match: {
            createdAt: {
                $gte: new Date(year, month, (day - 4), "00", "00", "00"),
                $lt: new Date(year, month, day, "24", "00", "00")
            }
        }
    }, {
        $group: {
            _id: {
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                }
            },
            count: {
                $sum: 1
            }
        }
    }, { $project: { _id: 0, visiter: "$_id", totalvisit: "$count" } }]);

    var label = [];
    var datax = [];
    var colors = [];
    label.push([year, (month + 1), (day - 4)].join('-'))
    label.push([year, (month + 1), (day - 3)].join('-'))
    label.push([year, (month + 1), (day - 2)].join('-'))
    label.push([year, (month + 1), (day - 1)].join('-'))
    label.push([year, (month + 1), (day)].join('-'))
    label.forEach((v, i) => {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        colors.push('#' + randomColor)
        var items = search(v, reslt);
        if (items != undefined) {
            datax.push(items.totalvisit);
        } else {
            datax.push(0);
        }
    })

    var data = {
        title: "Visitor",
        subtitle: "Jumlah Visitor Per 5 hari",
        data: {
            labels: label,
            datasets: [
                {
                    label: 'Jumlah  Visitor',
                    data: datax,
                    // you can set indiviual colors for each bar
                    backgroundColor: colors,
                    borderWidth: 1,
                }
            ]
        }
    }

    res.status(200).send({ data })
}

function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].visiter.date === nameKey) {
            return myArray[i];
        }
    }
}

exports.getPaging = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const offset = limit * page;

    let filter = {}

    const totalRows = await logVisitorLogin.find(filter).countDocuments()
    const totalPage = Math.ceil(totalRows / limit);
    const reslt = await logVisitorLogin.find(filter).skip(offset).sort('-year').limit(limit)
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
        let reslt = await logVisitorLogin.findById(username).exec();
        res.send({ data: await reslt });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving galleries"
        });
    }
}

exports.create = async (req, res) => {
    try {
        let { username } = await req.body
        let logVisitorData = []
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
        logVisitorData.push(new logVisitorLogin({
            username: username,
            lastActiveAt: [year, month, day].join('-')
        }))
        logVisitorLogin.insertMany(logVisitorData).then((result) => {
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
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while create Photo"
        })
    }
}