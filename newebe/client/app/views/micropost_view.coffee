View = require '../lib/view'
Renderer = require '../lib/renderer'
MicroPost = require '../models/micropost'
NoteSelector = require './note_selector'

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
        pictureId = @model.get('pictures_to_download')[0]
        @downloadButton.click =>
            @model.downloadPicture pictureId, (err) =>
                if err
                    alert 'Picture cannot be loaded'
                else
                    @hideDlBtnAndDisplayPicture pictureId

    hideDlBtnAndDisplayPicture: (pictureId) =>
        @downloadButton.prev().fadeOut()
        @downloadButton.fadeOut =>
            @downloadButton.after """
<a href="pictures/#{pictureId}/#{pictureId}.jpg">
<img class="post-picture" src="pictures/#{pictureId}/prev_#{pictureId}.jpg" />
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
        @$el.select()
        @buttons.show()

    onDeleteClicked: ->
        @model.url = "microposts/#{@model.id}/"
        @model.destroy
            success: => @remove()
            error: => alert 'server error occured'

    onSaveToNoteClicked: ->
        NoteSelector.getDialog().show @model