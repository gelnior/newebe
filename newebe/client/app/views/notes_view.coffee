View = require '../lib/view'
NotesView = require './notes'
Note = require '../models/note'

module.exports = class NotesMainView extends View
    id: 'notes-view'

    events:
        'click #add-note': 'onAddNoteClicked'
        'click #sort-date-note': 'onSortDateClicked'
        'click #sort-title-note': 'onSortTitleClicked'

    template: ->
        require './templates/notes_view'

    afterRender: ->

    onAddNoteClicked: ->
        @notesView.addNote new Note title: 'New note', content: ''

    onSortDateClicked: ->
        @notesView.sortByDate()

    onSortTitleClicked: ->
        @notesView.sortByTitle()

    fetch: ->
        @notesView ?= new NotesView()
        @notesView.fetch()
        @isLoaded = true
