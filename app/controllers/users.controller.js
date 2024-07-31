const db = require('../models')
const bcrypt = require("bcrypt");
const Users = db.users


exports.getAll = async (req, res) => {
    try {
        const users = await Users.find()
        res.status(200).send({ users })
    } catch (error) {
        res.status(400).send(error.message)
    }
}



exports.findById = async (req, res) => {
    try {
        let id = req.params.id
        let users = await Users.findById(id).exec();
        res.send({ data: await users });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving user"
        });
    }
}

exports.create = async (req, res) => {
    try {
        let body = await req.body
        const user = new Users(body);
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        user.password = await bcrypt.hash(user.password, salt);
        user.save().then((result) => {
            // let jumlahData = [{ 'jumlahData': result.length }]
            // jumlahData.push(result)
            res.status(200).send({
                message: "User has been Inserted"
            });
        }).catch((err) => {
            res.status(400).send({
                message: err.message || "Some error while create User"
            })
        });

    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while create User"
        })
    }
}


exports.update = async (req, res) => {
    try {
        let id = await req.params.id
        let { username, password } = await req.body
        const salt = await bcrypt.genSalt(10);
        const users = await Users.findById(id);
        users.username = username;
        console.log(password)
        console.log(users.password)
        if (password !== "") {
            password = await bcrypt.hash(password, salt);
            users.password = password;
        }

        await users.save();

        res.status(200).send({
            message: "User has been Updated"
        });


    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving User"
        });
    }
}


exports.delete = async (req, res) => {
    try {
        const id = req.body.id;
        const users = await Users.findById(id);
        users.remove();
        res.status(200).send({
            message: "User has been Deleted"
        });
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error while retrieving User"
        });
    }
}