View = require '../lib/view'

module.exports = class ActivitiesView extends View
    id: 'activities-view'

    template: ->
        require('./templates/activities')
