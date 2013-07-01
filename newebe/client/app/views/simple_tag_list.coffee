CollectionView = require '../lib/view_collection'
TagView = require './simple_tag_view'
Tags = require '../collections/tags'
stringUtils = require '../lib/string'


module.exports = class SimpleTagListView extends CollectionView

    collection: new Tags()
    view: TagView

    constructor: (@el) ->
        super()
        @selectedTag = 'all'

    template: ->
        require './templates/simple_tags'

    fetch: (callbacks) ->
        @remove(@views) if @views.length > 0
        @collection.fetch callbacks

    select: (name) ->
        @selectedTag = name
        @$(".tag-selector button").unselect()
        @$(".tag-#{name} button").select()
