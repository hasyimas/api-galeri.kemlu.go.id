const jwt = require('../config/jwt.config')
const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.jwt.verify(token, jwt.TOKEN_KEY);
        return res.status(200).json(decoded);

    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
    // return next();
};

module.exports = verifyToken;