View = require '../lib/view'
Renderer = require '../lib/renderer'

module.exports = class NoteView extends View
    className: 'note simple-row line ml1 mr1 pt1 pb1'

    events:
        'click': 'onClicked'
        'click .note-delete-button': 'onDeleteClicked'

    template: -> require './templates/note'

    constructor: (@model) ->
        super()

    afterRender: ->
        @buttons = @$ '.note-buttons'
        @buttons.hide()
        renderer = new Renderer()
        @model.set 'content', 'Empty note' if @model.get('content').length is 0
        @model.set 'displayDate', renderer.renderDate @model.get 'lastModified'

        @contentField = @$ "#profile-description"
        @converter = new Showdown.converter()
        if @model.get("content").length > 0
            @descriptionField.html @converter.makeHtml(@model.get('description'))
        else
            @descriptionField.html "your description"
        @descriptionField.keyup =>
            @model.set "description", toMarkdown(@descriptionField.html())
        @model.bind 'save', =>
            @model.set "description", toMarkdown(@descriptionField.html())
            @model.save

    getRenderData: ->
        model: @model?.toJSON()

    onClicked: ->
        $('.note').removeClass 'selected'
        $('.note-buttons').hide()
        @$el.addClass 'selected'
        @buttons.show()

    onDeleteClicked: ->
        @model.destroy
            success: => @remove()
            error: => alert 'server error occured'
