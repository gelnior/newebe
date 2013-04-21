View = require '../lib/view'
MicroPost = require '../models/micropost'
ActivityListView = require '../views/activity_list_view'

module.exports = class ActivitiesView extends View
    id: 'activities-view'
    className: 'pa1'

    template: ->
        require './templates/activities'

    events:
        "keyup #micropost-field": "onMicropostFieldKeyup"
        "click #micropost-post-button": "createNewPost"
        "click #more-activities-button": "loadMoreActivities"

    afterRender: ->
        @activityList = new ActivityListView el: @$ "#activity-all"
        @isLoaded = false
        @micropostField = @$ "#micropost-field"

    fetch: ->
        @isLoaded = true
        @activityList.collection.fetch
            success: =>
                @isLoaded = true

    onMicropostFieldKeyup: (event) =>
        keyCode = if event.which then event.which else event.keyCode
        if keyCode is 13
            @createNewPost()
            event.preventDefault()
            false
        else
            true

    createNewPost: =>
        content = @micropostField.val()

        if content?.length isnt 0
            @micropostField.disable()

            micropost = new MicroPost()
            micropost.save 'content', content,
                success: =>
                    @activityList.prependMicropostActivity micropost
                    @micropostField.enable()
                    @micropostField.val null
                error: =>
                    @micropostField.enable()

    loadMoreActivities: =>
        @activityList.loadMore()
