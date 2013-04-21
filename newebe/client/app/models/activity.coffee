## Model for a single Activity
module.exports = class Activity extends Backbone.Model

    urlRoot: '/activities/all/'
    idAttribute: '_id'

    defaults:
        "tags": ["all"]

    setMicropost: (micropost) ->
        @set 'subdoc', micropost.attributes
        @set 'docId', micropost.get '_id'
        @set 'docType', 'Micropost'
        @set 'verb', 'writes'
        @set 'isMine', micropost.get 'isMine'
        @set 'author', micropost.get 'author'
        @set 'date', micropost.get 'date'
        @set 'method', 'POST'
