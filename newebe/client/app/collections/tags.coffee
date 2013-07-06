module.exports = class TagsCollection extends Backbone.Collection
    model: require '../models/tag'
    url: 'contacts/tags/'

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows

    comparator: (tag) ->
        return tag.get 'name'
