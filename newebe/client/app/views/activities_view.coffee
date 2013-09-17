View = require '../lib/view'
Activity = require '../models/activity'
ActivityListView = require '../views/activity_list_view'

module.exports = class ActivitiesView extends View
    id: 'activities-view'
    className: 'pa1'

    template: ->
        require './templates/activities'

    events:
        "click #more-activities-button": "loadMoreActivities"

    afterRender: ->
        @activityList = new ActivityListView el: @$ "#activity-all"
        @isLoaded = false

    fetch: ->
        @activityList.collection.fetch
            success: =>
            error: =>
                alert 'A server error occured while retrieving news feed'

    loadMoreActivities: =>
        @activityList.loadMore()
