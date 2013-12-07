TagView = require './tag_view'

module.exports = class TagAllView extends TagView
    className: 'tag-selector tag-all'

    events:
        'click .tag-select-button': 'onSelectClicked'
        'click .tag-add-button': 'onAddClicked'

    afterRender: ->
        @addTagButton = @$('.tag-add-button')
        @selectTagButton = @$('.tag-select-button')
        @addTagButton.hide() if @tagsView.isFull()

    template: ->
        require './templates/tag_all'

    onSelectClicked: ->
        @publish 'tag:selected', 'all'
        @selectTagButton.addClass 'selected'

    onAddClicked: ->
        @addTagButton.fadeOut =>
            @tagsView.showNewTagForm()
