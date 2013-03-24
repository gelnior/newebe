CollectionView = require '../lib/view_collection'
ActivityCollection = require '../collections/activity_collection'
ActivityView = require '../views/activity_view'

module.exports = class ActivityListView extends CollectionView
    collection: new ActivityCollection()
    view: ActivityView

    template: ->
        require('./templates/activity_list')

    afterRender: ->
        @$el.addClass 'activity-list mod left w33'
