const { CompareTrueError } = require('ldapjs');
var uniqueValidator = require('mongoose-unique-validator');
module.exports = (mongoose) => {

    const schema = mongoose.Schema(
        {
            username: { type: String, required: true },
            password: { type: String, required: true },
            lastActiveAt: { type: Date, },
        },
        { timestamps: true }
    )
    schema.plugin(uniqueValidator);
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const logUsersLogin = mongoose.model("log_users_logins", schema)
    return logUsersLogin
}