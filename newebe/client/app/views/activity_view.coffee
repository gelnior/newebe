View = require '../lib/view'
Renderer = require '../lib/renderer'

module.exports = class ActivityView extends View
    className: 'activity pt1 pb1 pl2'

    template: ->
        require('./templates/activity')

    constructor: (@model) ->
        super()

    getRenderData: ->
        renderer = new Renderer()
        @model.set 'content', renderer.renderDoc(@model.get('subdoc'))
        @model.set 'displayDate', renderer.renderDate(@model.get 'date')
        model: @model?.toJSON()
