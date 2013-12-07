View = require '../lib/view'
Activity = require '../models/activity'
ActivityListView = require '../views/activity_list_view'
request = require '../lib/request'

module.exports = class ActivitiesView extends View
    id: 'activities-view'
    className: 'pa1'

    template: ->
        require './templates/activities'

    events:
        "click #sync-activities-button": "onSyncClicked"
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


    # When sync button is clicked, the sync service is called, then user is
    # notified that sync process started.
    onSyncClicked: (event) ->
        $("#sync-activities-button").spin()
        request.get "/synchronize/", (err) ->
            $("#sync-activities-button").spin()
            if err
                alert "Synchronize process failed."
            else
                alert """
Synchronization process started, check back your data in a few minutes.
    """
