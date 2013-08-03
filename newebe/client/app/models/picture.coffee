Model = require '../lib/model'

module.exports = class PictureModel extends Model
    urlRoot: "pictures/all/"
    idAttribute: '_id'
