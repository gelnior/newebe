View = require '../lib/view'
Renderer = require '../lib/renderer'
MicroPost = require '../models/micropost'

module.exports = class MicropostView extends View
    className: 'micropost pt1 pb1 pl0'

    template: ->
        require './templates/micropost'

    events:
        'click': 'onClicked'
        'click .micropost-delete-button': 'onDeleteClicked'

    constructor: (@model) ->
        super()

    afterRender: ->
        @buttons = @$ '.micropost-buttons'

    getRenderData: ->
        renderer = new Renderer()
        @model.set 'displayContent', renderer.renderDoc @model
        @model.set 'displayDate', renderer.renderDate @model.get 'date'
        model: @model?.toJSON()

    onClicked: ->
        $('.micropost').removeClass 'selected'
        $('.micropost-buttons').hide()
        @$el.addClass 'selected'
        @buttons.show()

    onDeleteClicked: ->
        @model.url = "microposts/#{@model.id}/"
        @model.destroy
            success: =>
                @remove()
            error: =>
                alert 'server error occured'
