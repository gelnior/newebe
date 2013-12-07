## Model for a single Activity
module.exports = class Activity extends Backbone.Model

    urlRoot: '/activities/all/'
    idAttribute: '_id'

    defaults:
        "tags": ["all"]

    constructor: (activity) ->
        super activity

        @set 'errorAmount', activity.errors.length if activity.errors.length
