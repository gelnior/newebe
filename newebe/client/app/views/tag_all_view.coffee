View = require 'lib/view'

module.exports = class TagAllView extends View
    className: 'tag-selector'

    events:
        'click .tag-add-button': 'onAddClicked'

    constructor: (@model, @tagsView) ->
        super()

    afterRender: ->
        @addTagButton = @$('.tag-add-button')
        @addTagButton.hide() if @tagsView.isFull()

    template: ->
        require './templates/tag_all'

    getRenderData: ->
        model: @model?.toJSON()

    onAddClicked: ->
        # Should trigger an event but Backbone don't look to fire ite.
        @$('.tag-add-button').fadeOut =>
            @tagsView.showNewTagForm()
