View = require 'lib/view'

module.exports = class ContactView extends View
    class: 'contact'
    rootUrl: "contacts/"

    events:
        'click .contact-delete-button': 'onDeleteClicked'

    constructor: (@model) ->
        super()

    template: ->
        require('./templates/contact')

    getRenderData: ->
        model: @model?.toJSON()

    onDeleteClicked: ->
        @model.destroy
            success: =>
                @remove()
            error: =>
                alert 'An error occured while deleting contact'
