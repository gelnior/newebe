request = require '../lib/request'
View = require '../lib/view'
ViewCollection = require '../lib/view_collection'
NoteCollection = require '../collections/notes'

class NoteSelectorLine extends View
    tag: 'div'
    className: 'line note-selector-line'
    template: -> require './templates/note_selector_line'

    events:
        'click': 'onClick'

    onClick: ->
        $(".note-selector-line").removeClass 'selected'
        @$el.addClass 'selected'

    constructor: (@model) ->
        super()


class NoteSelectorList extends ViewCollection
    id: "note-selector-list"
    collection: new NoteCollection()
    view: NoteSelectorLine
    template: -> require './templates/note_selector_list'

    constructor: ->
        super()
        @$el = $("##{@id}")


class NoteSelectorWidget extends View
    id: "note-selector-widget"
    template: -> require './templates/note_selector_widget'

    events:
        'click .cancel': 'hide'

    constructor: ->
        super()
        @$el = $("##{@id}")

    afterRender: ->
        noteList = new NoteSelectorList
        noteList.render()
        noteList.collection.fetch()

        @$('.cancel').click @hide
        @$('.confirm').click =>
            for view in noteList.views
                if view.$el.hasClass 'selected'
                    @pushToNote view.model.id

    pushToNote: (noteId)  ->
        request.get "/notes/all/#{noteId}", (err, note) =>

            if err then alert "cannot retrieve note"
            else
                note.content = "#{note.content}\n\n#{@micropost.get 'content'}"

                request.put "/notes/all/#{noteId}", note, (err) =>
                    if err then alert "note update failed"
                    else
                        alert "note successfully updated"
                        @hide()

    show: (micropost) ->
        @micropost = micropost
        @$el.fadeIn()

    hide: ->
        @micropost = null
        @$el.fadeOut()


module.exports = NoteSelector = class NoteSelector


NoteSelector.getDialog = ->
    unless @dialog?
        @dialog = new NoteSelectorWidget()
        @dialog.render()
    @dialog
