CollectionView = require '../lib/view_collection'
TagView = require './tag_view'
TagAllView = require './tag_all_view'
Tags = require '../collections/tags'


module.exports = class TagsView extends CollectionView
    id: 'tag-list'

    collection: new Tags()
    view: TagView
    
    events:
        'keyup #new-tag-field': 'onNewTagKeyup'
        'click #new-tag-button': 'onNewTagClicked'
    
    afterRender: ->
        @newTagField = @$ '#new-tag-field'
        @newTagButton = @$ '#new-tag-button'
        @newTagButton.click @onNewTagClicked
        @newTagField.keyup @onNewTagKeyup
        @newTagField.keypress @onNewTagKeypress
        @newTagField.hide()
        @newTagButton.hide()
        @tagList = @$ '#tag-list'

    renderOne: (model) =>
        if model.get('name') isnt 'all'
            view = new @view model
        else
            view = new TagAllView model, @

        @tagList.append view.render().el
        @add view
        @

    showNewTagForm: ->
        if @collection.length < 6
            @newTagField.show()
            @newTagButton.show()
            @newTagField.focus()

    template: ->
        @$el = $ "##{@id}"
        require './templates/tags'

    fetch: (callbacks) ->
        @$el = $ "##{@id}"
        @afterRender()
        @remove(@views) if @views.length > 0
        @collection.fetch callbacks

    onNewTagKeypress: (event) =>
        key = event.which
        keychar = String.fromCharCode(key).toLowerCase()
        if (key is null) or (key is 0) or (key is 8) or (key is 9) or
        (key is 13) or (key is 27)
             return true
        else if ('abcdefghijklmnopqrstuvwxyz0123456789').indexOf(keychar) is -1
            event.preventDefault()
            return false

    onNewTagKeyup: (event) =>
        @onNewTagClicked() if event.which is 13

    onNewTagClicked: =>
        unless @isFull()
            @collection.create name: @newTagField.val(),
                success: (tag) =>
                    @renderOne tag
                    @newTagField.val ''

    isFull: ->
        @collection.length > 6
