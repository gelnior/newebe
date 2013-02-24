View = require 'lib/view'

module.exports = class ContactView extends View
    class: 'contact'
    rootUrl: "contacts/"

    events:
        'click .contact-delete-button': 'onDeleteClicked'
        'click .contact-retry-button': 'onRetryClicked'
        'click .contact-accept-button': 'onAcceptClicked'

    constructor: (@model) ->
        super()

    template: ->
        require('./templates/contact')

    afterRender: ->
        if @model.get('state') isnt 'Error'
            @$('.contact-retry-button').hide()
        if @model.get('state') isnt 'Wait for approval'
            @$('.contact-accept-button').hide()

    getRenderData: ->
        model: @model?.toJSON()

    onDeleteClicked: ->
        @model.destroy
            success: =>
                @remove()
            error: =>
                alert 'An error occured while deleting contact'

    onRetryClicked: ->
        @model.retry (err) =>
            if err
                alert 'Contact request failed again.'
            else
                @$('.state').html 'Pending'
                
    onAcceptClicked: ->
        @model.accept (err) =>
            if err
                alert 'Contact approval failed.'
                @$('.state').html 'Error'
                @$('.contact-retry-button').show()
            else
                @$('.state').html 'Trusted'
