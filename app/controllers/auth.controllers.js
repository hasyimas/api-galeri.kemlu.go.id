const client = require("../config/ldap.config");
const jwt = require("../config/jwt.config");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).json("All input is required");
        }

        client.bind(`uid=${username},dc=kemlu,dc=go,dc=id`, password, (error, result) => {
            if (error) {
                res.status(400).json({ message: error.message || "LDAP: Wrong username or password" });
            } else {
                const token = jwt.jwt.sign({ username: username }, jwt.TOKEN_KEY);
                res.status(200).json({
                    username: username,
                    token: token
                });
            }
        });

    } catch (error) {
        res.status(400).send({
            message: error.message || "Error in Login LDAP"
        });
    }

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
