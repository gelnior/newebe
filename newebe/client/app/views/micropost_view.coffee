View = require '../lib/view'
Renderer = require '../lib/renderer'
MicroPost = require '../models/micropost'
NoteSelector = require './note_selector'
request = require '../lib/request'

module.exports = class MicropostView extends View
    className: 'micropost pt1 pb1 pl1 line'

    template: ->
        require './templates/micropost'

    events:
        'click': 'onClicked'
        'click .micropost-delete-button': 'onDeleteClicked'
        'click .micropost-save-to-note-button': 'onSaveToNoteClicked'

    constructor: (@model) ->
        super()

    afterRender: ->
        @buttons = @$ '.micropost-buttons'

        @downloadButton = @$ '.download-picture-btn'
        pictureId = @model.get('pictures_to_download')?[0]

        @downloadRunning = false
        @downloadButton.click =>
            unless @downloadRunning
                @downloadRunning = true
                @model.downloadPicture pictureId, (err) =>
                    if err
                        alert 'Picture cannot be loaded'
                    else
                        @hideDlBtnAndDisplayPicture pictureId

        @downloadButton = @$ '.download-common-btn'
        commonId = @model.get('commons_to_download')?[0]
        @downloadButton.click =>
            unless @downloadRunning
                @downloadRunning = true
                @model.downloadCommon commonId, (err) =>
                    if err
                        alert 'Common cannot be loaded'
                    else
                        @hideDlBtnAndDisplayCommon commonId


    hideDlBtnAndDisplayPicture: (pictureId) =>
        @downloadButton = @$ '.download-picture-btn'

        @downloadButton.prev().fadeOut()
        @downloadButton.fadeOut =>
            @downloadButton.after """
<a href="pictures/#{pictureId}/#{pictureId}.jpg">
<img class="post-picture" src="pictures/#{pictureId}/prev_#{pictureId}.jpg" />
</a>
"""
            @downloadRunning = false

    hideDlBtnAndDisplayCommon: (commonId) =>
        @downloadButton.prev().fadeOut()
        @downloadButton.fadeOut =>
            @downloadRunning = false
            request.get "/commons/#{commonId}/", (err, commonRows) =>
                common = commonRows.rows[0]
                @downloadButton.after """
    <a href="commons/#{commonId}/#{common.path}">
    #{common.path}
    </a>
    """

    getRenderData: ->
        renderer = new Renderer()
        @model.set 'displayContent', renderer.renderDoc @model
        @model.set 'displayDate', renderer.renderDate @model.get 'date'
        model: @model?.toJSON()

    onClicked: ->
        $('.micropost').removeClass 'selected'
        $('.micropost-buttons').hide()

        commons = @model.get 'commons'
        @$el.select()
        @buttons.show()

    onDeleteClicked: ->
        @model.url = "microposts/#{@model.id}/"
        button = @$(".micropost-delete-button")
        button.spin 'small'
        @model.destroy
            success: => @remove()
            error: =>
                button.spin()
                alert 'server error occured, the micropost cannot be deleted.'

    onSaveToNoteClicked: ->
        NoteSelector.getDialog().show @model
