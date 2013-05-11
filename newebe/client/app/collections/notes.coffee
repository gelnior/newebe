module.exports = class NotesCollection extends Backbone.Collection
    model: require '../models/note'
    url: 'notes/all/'

    parse: (response) -> response.rows
