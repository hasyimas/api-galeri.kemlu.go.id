const { CompareTrueError } = require('ldapjs');
var uniqueValidator = require('mongoose-unique-validator');
module.exports = (mongoose) => {
    const Schema = mongoose.Schema
    const ObjectId = Schema.Types.ObjectId
    let UserSchema = new mongoose.Schema(

        {
            files_id: { type: ObjectId },
            files_type: { type: String, required: true },
            username: { type: String, required: true },
            lastDownloadAt: { type: Date, },
        },
        { timestamps: true }
    )
    UserSchema.plugin(uniqueValidator);
    UserSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const filesDownload = mongoose.model("files_downloads", UserSchema)
    return filesDownload
}