View = require '../lib/view'
Renderer = require '../lib/renderer'
request = require '../lib/request'

module.exports = class PictureView extends View
    className: 'picture pa1 w33 col'
    template: -> require './templates/picture'

    events:
        'click': 'onClicked'
        'click .picture-delete-button': 'onDeleteClicked'
        'click .picture-rotate-button': 'onRotateClicked'

    onClicked: ->
        $('.picture').unselect()
        $('.picture-buttons').hide()
        @$el.select()
        @buttons.show()


    onDeleteClicked: ->
        @model.urlRoot = 'pictures/'
        @model.destroy
            success: => @remove()
            error: => alert 'server error occured'

    onRotateClicked: =>
        request.get "pictures/#{@model.id}/rotate/", (err) =>
            if err then alert 'An error occured while rotating picture.'
            else
                alert 'Picture rotation succceeded.'
                src = @$('img').attr 'src'
                @$('img').attr 'src', src + '?rotate'


    constructor: (@model) -> super()

    afterRender: ->
        @buttons = @$ '.picture-buttons'
        @buttons.hide()

    getRenderData: ->
        renderer = new Renderer()
        @model.set 'displayDate', renderer.renderDate @model.get 'date'
        model: @model?.toJSON()
