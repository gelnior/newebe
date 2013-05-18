Model = require '../lib/model'

module.exports = class NoteModel extends Model
    urlRoot: "notes/all/"
    idAttribute: '_id'
