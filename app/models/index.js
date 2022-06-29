const dbConfig = require("../config/db.config");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.mongoURI
db.galleries = require('./galleries.model')(mongoose)
db.users = require('./users.model')(mongoose)
//-------------------------- mongodb

module.exports = db
