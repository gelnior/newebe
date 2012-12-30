Activity = require '../models/activity_model'

## Activity collection
class ActivityCollection extends Backbone.Collection
    model: Activity

    # Url where activities can be retrieved.
    url: '/activities/all/'

    # Collection sorting is based on activity date.
    comparator: (activity) ->
        activity.get "date"

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows

module.exports = ActivityCollection
