View = require 'lib/view'

module.exports = class TagView extends View
    className: 'tag-selector'

    events:
        'click .tag-select-button': 'onSelectClicked'
        'click .tag-delete-button': 'onDeleteClicked'

    constructor: (@model, @tagsView) ->
        super()

    template: ->
        require './templates/tag'

    afterRender: ->
        @selectTagButton = @$('.tag-select-button')
        @$el.addClass "tag-#{@model.get 'name'}"

    getRenderData: ->
        model: @model?.toJSON()

    onSelectClicked: ->
        @publish 'tag:selected', @model.get 'name'
        @selectTagButton.select()

    onDeleteClicked: ->
        button = $(".tag-delete-button")
        button.spin 'tiny'
        @model.destroy
            success: =>
                @tagsView.onTagDeleted @model.get 'name'
                @remove()
            error: =>
                button.spin()
                alert 'An error occured while deleting tag'
