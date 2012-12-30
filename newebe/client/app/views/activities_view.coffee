CollectionView = require '../lib/view_collection'
ActivityCollection = require '../collections/activity_collection'
ActivityView = require '../views/activity_view'

module.exports = class ActivitiesView extends CollectionView
    id: 'activities-view'
    collection: new ActivityCollection()
    view: ActivityView

    template: ->
        require('./templates/activities')
