View = require '../lib/view'
Renderer = require '../lib/renderer'

module.exports = class NoteView extends View
    className: 'note simple-row line ml1 mr1 pt1 pb1'

    events:
        'click': 'onClicked'
        'click .note-delete-button': 'onDeleteClicked'
        'mousedown .editable': 'editableClick'
        "keyup .note-title": "onNoteChanged"

    editableClick: etch.editableInit

    template: -> require './templates/note'

    constructor: (@model) ->
        super()

    afterRender: ->
        @buttons = @$ '.note-buttons'
        @buttons.hide()
        @contentField = @$ '.content-note'
        @contentField.hide()
        @model.bindField 'title', @$(".note-title")

        renderer = new Renderer()
        @model.set 'content', 'Empty note' if @model.get('content').length is 0
        @model.set 'displayDate', renderer.renderDate @model.get 'lastModified'

        @converter = new Showdown.converter()
        if @model.get("content").length > 0
            @contentField.html @converter.makeHtml(@model.get('content'))
        else
            @contentField.html "new note content"

        @contentField.keyup =>
            @model.set "content", toMarkdown(@contentField.html())
            @onNoteChanged()

        @model.bind 'save', =>
            @model.set "content", toMarkdown(@contentField.html())
            @model.save

    getRenderData: ->
        model: @model?.toJSON()

    onNoteChanged: ->
        @model.save()

    onClicked: ->
        $('.note').removeClass 'selected'
        $('.note-buttons').hide()
        $('.content-note').hide()
        @$el.addClass 'selected'
        @buttons.show()
        @contentField.show()

    onDeleteClicked: ->
        @model.destroy
            success: => @remove()
            error: => alert 'server error occured'

    emptyTitle: ->
        @$(".note-title").val ''

    focusTitle: ->
        @$(".note-title").focus()
