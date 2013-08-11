View = require '../lib/view'

class NoteSelectorWidget extends View

    id: "note-selector-widget"
    template: -> require './templates/note_selector_widget'
    afterRender: ->
        @$el = $("##{@id}")
    show: ->
        alert 'show'
        @$el.show()


module.exports = NoteSelector = class NoteSelector

NoteSelector.getDialog = ->
    @dialog = new NoteSelectorWidget() unless @dialog?
    @dialog
