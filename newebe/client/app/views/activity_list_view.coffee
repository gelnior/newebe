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
        @collection.url = @collection.baseUrl + @getLastDate()
        @collection.fetch
            success: (activities) =>
                activities.models.slice()
                @renderOne activity for activity in activities.models
            error: =>
                alert 'server error occured'

    getLastDate: ->
        activity = @collection.last()
        if activity?
            lastDate = moment activity.get 'date'
            return lastDate.format('YYYY-MM-DD') + '-23-59-00/'
        else
            return ''
