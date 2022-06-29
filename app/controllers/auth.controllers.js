const client = require("../config/ldap.config");
const jwt = require("../config/jwt.config");
const ldap = require("../config/url.config");
const axios = require('axios').default;
const bcrypt = require("bcrypt");
const db = require('../models')
const Users = db.users
exports.login = async (req, res) => {

    const { username, password } = req.body;
    // try {
    if (!(username && password)) {
        res.status(400).json("All input is required");
    }
    await axios.post(`${ldap}/api/login`, {
        username: username,
        password: password
    }).then(response => {
        const token = jwt.jwt.sign({ username: response.data.username }, jwt.TOKEN_KEY);
        res.status(200).json({
            username: username,
            token: token
        });
    }).catch(async err => {
        
        const user = await Users.findOne({ username: username });
        if (user) {
            // check user password with hashed password stored in the database
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = jwt.jwt.sign({ username: user.username }, jwt.TOKEN_KEY);
                res.status(200).json({
                    username: username,
                    token: token
                });
            } else {
                res.status(400).json({ error: "Invalid Password" });
            }
        } else {
            res.status(401).json({ error: "User does not exist" });
        }
    })
}

exports.logout = async (req, res) => {
    const authHeader = req.headers["x-access-token"];
    // client.unbind();
    // client.destroy();
    jwt.jwt.sign(authHeader, jwt.TOKEN_KEY, { expiresIn: 1 }, (logout, err) => {
        if (logout) {
            res.status(200).json({ msg: 'true' });
        } else {
            res.status(200).json({ msg: 'false' });
        }
    });

}
