View = require '../lib/view'

class NoteSelectorWidget extends View

    id: "note-selector-widget"
    template: -> require './templates/note_selector_widget'

    constructor: ->
        super()
        @$el = $("##{@id}")

    show: (model) ->
        @$el.show()


module.exports = NoteSelector = class NoteSelector

NoteSelector.getDialog = ->
    @dialog = new NoteSelectorWidget() unless @dialog?
    @dialog
