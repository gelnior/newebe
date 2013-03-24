CollectionView = require '../lib/view_collection'
TagView = require './tag_view'
Tags = require '../collections/tags'


module.exports = class TagsView extends CollectionView
    id: 'tag-list'

    collection: new Tags()
    view: TagView
    
    events:
        "click #new-tag-button": "onNewTagClicked"
    
    afterRender: ->
        @newTagField = @$ "#new-tag-field"
        @$("#new-tag-button").click @onNewTagClicked

    template: ->
        @$el = $ "##{@id}"
        require './templates/tags'

    fetch: (callbacks) ->
        @$el = $ "##{@id}"
        @afterRender()
        if @views.length > 0
            @remove @views
        @collection.fetch callbacks

    onNewTagClicked: =>
        @collection.create name: @newTagField.val(),
            success: (tag) => @renderOne tag
