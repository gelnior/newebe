CollectionView = require '../lib/view_collection'
NotesCollection = require '../collections/notes'
NoteView = require './note'

module.exports = class NotesView extends CollectionView
    el: '#notes'

    collection: new NotesCollection()
    view: NoteView

    template: ->
        require './templates/notes'

    afterRender: ->

    fetch: ->
        @collection.fetch()

    addNote: (note) ->
        @collection.url = "notes/all/"
        @collection.create note,
            silent: true
            success: (model) ->
                @renderOne model, prepend: true
            error: -> alert 'Note creation failed'
        @last().onClicked()
        @last().emptyTitle()
        @last().focusTitle()

    sortByDate: ->
        @remove @views
        @collection.reset()
        @collection.url = "notes/all/order-by-date/"
        @collection.fetch()

    sortByTitle: ->
        @remove @views
        @collection.reset()
        @collection.url = "notes/all/order-by-title/"
        @collection.fetch()
