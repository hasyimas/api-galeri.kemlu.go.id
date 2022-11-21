const dbConfig = require("../config/db.config");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.mongoURI
db.galleries = require('./galleries.model')(mongoose)
db.users = require('./users.model')(mongoose)
db.logUsersLogin = require('./log_users_login.model')(mongoose)
db.logVisitorLogin = require('./log_visitor_login.model')(mongoose)
db.filesDownload = require('./files_download.model')(mongoose)
//-------------------------- mongodb

module.exports = db
