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
        @$el.spin 'small'
        @collection.fetch
            success: =>
                @$el.spin()
            error: =>
                @$el.spin()

    addNote: (note) ->
        @collection.url = "notes/all/"
        @collection.create note,
            silent: true
            success: (model) =>
                @renderOne model, prepend: true
                @last()?.onClicked()
                @last()?.emptyTitle()
                @last()?.focusTitle()
            error: -> alert 'Note creation failed'

    sortByDate: ->
        @remove @views
        @collection.reset()
        @collection.url = "notes/all/order-by-date/"
        @fetch()

    sortByTitle: ->
        @remove @views
        @collection.reset()
        @collection.url = "notes/all/order-by-title/"
        @fetch()
