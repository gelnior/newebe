View = require '../lib/view'
Renderer = require '../lib/renderer'

module.exports = class CommonView extends View
    className: 'common pa1'
    template: -> require './templates/common'

    events:
        'click': 'onClicked'
        'click .common-delete-button': 'onDeleteClicked'

    onClicked: ->
        $('.common').unselect()
        $('.common-buttons').hide()
        @$el.select()
        @buttons.show()


    onDeleteClicked: ->
        @model.urlRoot = 'commons/'
        @model.destroy
            success: => @remove()
            error: => alert 'server error occured'

    constructor: (@model) -> super()

    afterRender: ->
        @buttons = @$ '.common-buttons'
        @buttons.hide()

    getRenderData: ->
        renderer = new Renderer()
        @model.set 'displayDate', renderer.renderDate @model.get 'date'
        model: @model?.toJSON()
