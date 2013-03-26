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

    getRenderData: ->
        model: @model?.toJSON()

    onSelectClicked: ->


    onDeleteClicked: ->
        @model.destroy
            success: =>
                @remove()
            error: =>
                alert 'An error occured while deleting tag'
