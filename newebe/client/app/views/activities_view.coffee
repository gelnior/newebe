View = require '../lib/view'
ActivityListView = require '../views/activity_list_view'

module.exports = class ActivitiesView extends View
    id: 'activities-view'

    template: ->
        require('./templates/activities')

    afterRender: ->
        @activityList = new ActivityListView(el: @$("#activity-all"))

    load: ->
        @activityList.collection.fetch()
