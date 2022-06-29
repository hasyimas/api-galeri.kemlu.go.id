var uniqueValidator = require('mongoose-unique-validator');
module.exports = (mongoose) => {

    const schema = mongoose.Schema(
        {
            username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
            password: { type: String, required: true },
        },
        { timestamps: true }
    )
    schema.plugin(uniqueValidator);
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Users = mongoose.model("users", schema)
    return Users
}