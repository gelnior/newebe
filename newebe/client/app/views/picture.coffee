View = require '../lib/view'
Renderer = require '../lib/renderer'

module.exports = class PictureView extends View
    className: 'picture pa1'
    template: -> require './templates/picture'

    events:
        'click': 'onClicked'
        'click .picture-delete-button': 'onDeleteClicked'

    onClicked: ->
        $('.picture').unselect()
        $('.picture-buttons').hide()
        @$el.select()
        @buttons.show()

    onDeleteClicked: ->
        @model.destroy
            success: => @remove()
            error: => alert 'server error occured'

    constructor: (@model) -> super()

    afterRender: ->
        @buttons = @$ '.picture-buttons'
        @buttons.hide()

        @renderPicture()

    renderPicture: ->
        #TODO

    getRenderData: ->
        model: @model?.toJSON()
