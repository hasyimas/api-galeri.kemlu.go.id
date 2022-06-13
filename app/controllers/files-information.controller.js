const exiftool = require("exiftool-vendored").exiftool;

exports.getInfromationFile = async (req, res) => {
    try {
        let { files } = await req;
        let exifData = await exiftool.read(await files[0].path)
        res.status(200).send({
            data: exifData
        });

    } catch (err) {
        res.status(409).send({
            message: err.message || "Some error while read file"
        })
    }
}