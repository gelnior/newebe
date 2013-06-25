Micropost = require '../models/micropost'

## Micropost collection
module.exports = class MicropostCollection extends Backbone.Collection
    model: Micropost

    # Url where activities can be retrieved.
    url: '/microposts/all/'
    baseUrl: '/microposts/all/'

    # Collection sorting is based on micropost date.
    comparator: (micropost, micropost2) ->
        micropost.get 'date' < micropost2.get 'date'

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows
