View = require '../lib/view'
Renderer = require '../lib/renderer'
MicroPost = require '../models/micropost'

module.exports = class ActivityView extends View
    className: 'activity pl0'

    template: ->
        require './templates/activity'

    events:
        'click': 'onClicked'

    constructor: (@model) ->
        super()

    getRenderData: ->
        renderer = new Renderer()
        @model.set 'displayDate', renderer.renderDate @model.get 'date'
        model: @model?.toJSON()

    onClicked: ->
        $('.activity').removeClass 'selected'
        @$el.addClass 'selected'
