View = require '../lib/view'

module.exports = class NoteView extends View
    className: 'note'

    template: -> require './templates/note'

    constructor: (@model) ->
        super()

    getRenderData: ->
        model: @model?.toJSON()

