View = require '../lib/view'

module.exports = class ActivityView extends View
    class: 'activity'

    template: ->
        require('./templates/activity')

    constructor: (@model) ->
        super()
