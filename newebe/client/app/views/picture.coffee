View = require '../lib/view'
Renderer = require '../lib/renderer'

module.exports = class PictureView extends View
    className: 'picture pa1 w33 col'
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
        @model.urlRoot = 'pictures/'
        @model.destroy
            success: => @remove()
            error: => alert 'server error occured'

    constructor: (@model) -> super()

    afterRender: ->
        @buttons = @$ '.picture-buttons'
        @buttons.hide()

    getRenderData: ->
        renderer = new Renderer()
        @model.set 'displayDate', renderer.renderDate @model.get 'date'
        model: @model?.toJSON()
