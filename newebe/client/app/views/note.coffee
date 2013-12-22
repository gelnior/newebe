View = require '../lib/view'
Renderer = require '../lib/renderer'

module.exports = class NoteView extends View
    className: 'note simple-row line ml1 mr1 pt1 pb1'

    events:
        'click': 'onClicked'
        'click .note-delete-button': 'onDeleteClicked'
        'click .note-unselect-button': 'onUnselectClicked'
        #'click .note-edit-button': 'editableClick'
        'mousedown .editable': 'editableClick'
        "keyup .note-title": "onNoteChanged"

    onClicked: (event) ->
        unless $(event.target).hasClass 'note-unselect-button'
            $('.note').unselect()
            $('.note-buttons').hide()
            $('.content-note').hide()
            @$el.select()
            @buttons.show()
            @contentField.show()

    onDeleteClicked: ->
        button = @$('.note-delete-button')
        button.spin 'small'
        @model.destroy
            success: =>
                button.spin()
                @remove()
            error: =>
                button.spin()
                alert 'server error occured, note cannot be deleted'

    onNoteChanged: ->
        @model.save()

    editableClick: etch.editableInit

    template: -> require './templates/note'

    constructor: (@model) ->
        super()

    afterRender: ->
        @buttons = @$ '.note-buttons'
        @buttons.hide()
        @contentField = @$ '.content-note'
        @contentField.hide()

        @renderTitle()
        @renderNote()
        @bindFields()

    renderTitle: ->
        renderer = new Renderer()
        @model.set 'content', 'Empty note' if @model.get('content').length is 0
        @model.set 'displayDate', renderer.renderDate @model.get 'lastModified'

    renderNote: ->
        @converter = new Showdown.converter()
        if @model.get("content").length > 0
            @contentField.html @converter.makeHtml(@model.get('content'))
        else
            @contentField.html "new note content"

    bindFields: ->
        @model.bindField 'title', @$(".note-title")
        @contentField.keyup =>
            @model.set "content", toMarkdown(@contentField.html())
            @onNoteChanged()

        @model.bind 'save', =>
            @model.set "content", toMarkdown(@contentField.html())
            @model.save

    getRenderData: ->
        model: @model?.toJSON()

    emptyTitle: ->
        @$(".note-title").val ''

    focusTitle: ->
        @$(".note-title").focus()

    onUnselectClicked: =>
        @$el.unselect()
        @$('.note-buttons').hide()
        @$('.content-note').hide()

