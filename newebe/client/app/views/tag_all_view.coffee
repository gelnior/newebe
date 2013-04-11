View = require 'lib/view'

module.exports = class TagAllView extends View
    className: 'tag-selector tag-all'

    events:
        'click .tag-select-button': 'onSelectClicked'
        'click .tag-add-button': 'onAddClicked'

    constructor: (@model, @tagsView) ->
        super()

    afterRender: ->
        @addTagButton = @$('.tag-add-button')
        @selectTagButton = @$('.tag-select-button')
        @addTagButton.hide() if @tagsView.isFull()

    template: ->
        require './templates/tag_all'

    getRenderData: ->
        model: @model?.toJSON()

    onSelectClicked: ->
        @publish 'tag:selected', 'all'
        @selectTagButton.addClass 'selected'

    onAddClicked: ->
        @$('.tag-add-button').fadeOut =>
            @tagsView.showNewTagForm()
