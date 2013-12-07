CollectionView = require '../lib/view_collection'
TagView = require './tag_view'
TagAllView = require './tag_all_view'
Tags = require '../collections/tags'
stringUtils = require '../lib/string'


module.exports = class FilterTagsView extends CollectionView
    el: '.filter-tag-list'

    collection: new Tags()
    view: TagView

    template: ->
        require './templates/filter_tags'

    fetch: (callbacks) ->
        @remove(@views) if @views.length > 0
        @collection.fetch callbacks
