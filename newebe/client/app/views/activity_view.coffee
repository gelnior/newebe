View = require '../lib/view'

module.exports = class ActivityView extends View
    className: 'activity pt1 pb1 pl2'

    template: ->
        require('./templates/activity')

    constructor: (@model) ->
        super()

    getRenderData: ->
        @renderContent()
        @renderDate()
        model: @model?.toJSON()

    renderContent: ->
        if @model.get('docType') is 'micropost'
            @model.set 'content', @model.get('subdoc').content
        else
            @model.set 'content', ''
 
    renderDate: ->
        date =  moment(@model.get('date'), 'YYYY-MM-DDThh:mm:ssZ')
        @model.set 'displayDate', date.format('D MMM  YYYY, hh:mm')
