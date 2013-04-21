View = require '../lib/view'
Renderer = require '../lib/renderer'
MicroPost = require '../models/micropost'

module.exports = class ActivityView extends View
    className: 'activity pt1 pb1 pl0'

    template: ->
        require './templates/activity'

    events:
        'click': 'onClicked'
        'click .activity-delete-button': 'onDeleteClicked'

    constructor: (@model) ->
        super()

    afterRender: ->
        @buttons = @$ '.activity-buttons'

    getRenderData: ->
        renderer = new Renderer()
        if @model.get('subdoc')?
            content = renderer.renderDoc @model.get 'subdoc'
        else content = ''
        @model.set 'content', content
        @model.set 'displayDate', renderer.renderDate @model.get 'date'
        model: @model?.toJSON()

    onClicked: ->
        $('.activity').removeClass 'selected'
        $('.activity-buttons').hide()
        @$el.addClass 'selected'
        @buttons.show() if @model.get('docType') is 'micropost'

    onDeleteClicked: ->
        micropost = new MicroPost @model.get 'subdoc'
        micropost.url = "/microposts/#{micropost.get('_id')}/"
        micropost.destroy
            success: =>
                @remove()
            error: =>
                alert 'server error occured'
