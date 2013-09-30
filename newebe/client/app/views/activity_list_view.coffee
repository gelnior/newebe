CollectionView = require '../lib/view_collection'
ActivityCollection = require '../collections/activity_collection'
ActivityView = require '../views/activity_view'
Activity = require '../models/activity'

module.exports = class ActivityListView extends CollectionView
    collection: new ActivityCollection()
    view: ActivityView

    template: ->
        require('./templates/activity_list')

    afterRender: ->
        @$el.addClass 'activity-list mod left w100'

    loadMore: ->
        $("#more-activities-button").spin 'small'
        collection = new ActivityCollection()
        collection.url = @collection.baseUrl + @getLastDate()
        collection.fetch
            success: (activities) =>
                activities.models.slice()
                @renderOne activity for activity in activities.models
                @setLastDate collection
                $("#more-activities-button").spin()
                if activities.length < 30
                    $("#more-activities-button").hide()

            error: =>
                alert 'server error occured'

    setLastDate: (collection) ->
        activity = collection.last()
        if activity?
            lastDate = moment activity.get 'date'
            @lastDate = lastDate.utc().format('YYYY-MM-DD-HH-mm-SS') + '/'
        else
            @lastDate = ''

    getLastDate: ->
        if @lastDate?
            @lastDate
        else
            @setLastDate @collection
            @getLastDate()
