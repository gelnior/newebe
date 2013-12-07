Activity = require '../models/activity'

## Activity collection
module.exports = class ActivityCollection extends Backbone.Collection
    model: Activity

    # Url where activities can be retrieved.
    url: '/activities/all/'
    baseUrl: '/activities/all/'

    # Collection sorting is based on activity date.
    comparator: (activity, activity2) ->
        activity.get 'date' < activity2.get 'date'

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows
