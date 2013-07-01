View = require 'lib/view'

module.exports = class TagView extends View
    className: 'tag-selector'

    events:
        'click .tag-select-button': 'onSelectClicked'

    constructor: (@model, @tagsView) ->
        super()

    template: ->
        require './templates/simple_tag'

    afterRender: ->
        @selectTagButton = @$('.tag-select-button')
        @$el.addClass "tag-#{@model.get 'name'}"

    getRenderData: ->
        model: @model?.toJSON()

    onSelectClicked: ->
        @publish 'tag:selected', @model.get 'name'
        @select()

    select: ->
        @selectTagButton.select()
