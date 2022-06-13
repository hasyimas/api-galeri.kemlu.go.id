
module.exports = (mongoose) => {

    const schema = mongoose.Schema(
        {
            title: String,
            description: String,
            keywords: Array,
            year: String,
            fileSize: String,
            imageWidthInCm: String,
            imageHeightInCm: String,
            imageWidth: String,
            imageHeight: String,
            xResolution: String,
            yResolution: String,
            fileTypeExtension: String,
            fileType: String,
            sourceFile: String,
            bannerStat: { type: Boolean, default: false },
        },
        { timestamps: true }
    )

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Galleries = mongoose.model("galleries", schema)
    return Galleries
}