const { CompareTrueError } = require('ldapjs');
var uniqueValidator = require('mongoose-unique-validator');
module.exports = (mongoose) => {

    const schema = mongoose.Schema(
        {
            username: { type: String, required: true },
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

    const logVisitorLogin = mongoose.model("log_visitor_logins", schema)
    return logVisitorLogin
}