CollectionView = require '../lib/view_collection'
NotesCollection = require '../collections/notes'
Note = require '../models/note'
NoteView = require './note'

module.exports = class NotesView extends CollectionView
    id: 'notes-view'

    collection: new NotesCollection()
    view: NoteView

    events:
        'click #add-note': 'onAddNoteClicked'

    template: ->
        require './templates/notes'

    afterRender: ->
        @collection.on 'add', (model) =>
            @renderOne model, prepend: true

    fetch: ->
        @collection.fetch()

    onAddNoteClicked: ->
        note = new Note title: 'New note', content: ''
        @collection.create note,
            success: ->
            error: -> alert 'Note creation failed'
