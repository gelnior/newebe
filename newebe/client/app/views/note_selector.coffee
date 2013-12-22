request = require '../lib/request'
View = require '../lib/view'
ViewCollection = require '../lib/view_collection'
NoteCollection = require '../collections/notes'


# Line of the selector list.
class NoteSelectorLine extends View
    tag: 'div'
    className: 'line note-selector-line'
    template: -> require './templates/note_selector_line'

    events:
        'click': 'onClick'

    # Mark note as selected when it is clicked. This is for style purpose and
    # to make it easy to find which note the user selected.
    onClick: ->
        $(".note-selector-line").removeClass 'selected'
        @$el.addClass 'selected'

    constructor: (@model) ->
        super()


# List of notes displayed in the selector widget.
class NoteSelectorList extends ViewCollection
    id: "note-selector-list"
    collection: new NoteCollection()
    view: NoteSelectorLine
    template: -> require './templates/note_selector_list'

    constructor: ->
        super()
        @$el = $("##{@id}")


# A widget to select an existing note and push at its end a micropost content.
class NoteSelectorWidget extends View
    id: "note-selector-widget"
    template: -> require './templates/note_selector_widget'

    events:
        'click .cancel': 'hide'

    constructor: ->
        super()
        @$el = $("##{@id}")

    afterRender: ->
        @noteList = new NoteSelectorList
        @noteList.render()
        @noteList.collection.fetch()

        @$('.cancel').click @hide
        @$('.confirm').click @pushPostToSelectedNote


    # Find selected note via the selected class, push the micropost attached
    # to the dialog then save it.
    pushPostToSelectedNote: =>
        for view in @noteList.views
            if view.$el.hasClass 'selected'
                @pushToNote view.model.id

    # Add micropost content to note which has given ID.
    pushToNote: (noteId)  ->
        @$('.confirm').spin 'small'
        request.get "/notes/all/#{noteId}", (err, note) =>
            if err then alert "cannot retrieve note"
            else
                note.content = "#{note.content}\n\n#{@micropost.get 'content'}"

                request.put "/notes/all/#{noteId}", note, (err) =>
                    if err then alert "note update failed"
                    else
                        alert "note successfully updated"
                        @$('.confirm').spin()
                        @hide()

    show: (micropost) ->
        @micropost = micropost
        @$el.fadeIn()

    hide: =>
        @micropost = null
        @$el.fadeOut()


module.exports = NoteSelector = class NoteSelector

# Dialog factory, not sure it has sense with JS.
NoteSelector.getDialog = ->
    unless @dialog?
        @dialog = new NoteSelectorWidget()
        @dialog.render()
    @dialog
