CollectionView = require '../lib/view_collection'
Contacts = require '../collections/contacts'
ContactView = require './contact_view'

request = require 'lib/request'

module.exports = class ContactsView extends CollectionView
    id: 'contacts-view'

    collection: new Contacts()
    view: ContactView

    events:
        "click #add-contact-button": "onAddContactClicked"

    template: ->
        require './templates/contacts'

    afterRender: ->
        @isLoaded = false

        @newContactInput = @$ "#new-contact-field"
        @addContactButton = @$ "#add-contact-button"

        
    onAddContactClicked: =>
        contactUrl = @newContactInput.val()
        data = url: contactUrl
        
        @collection.create data,
            success: (model) =>
                @renderOne model
            error: =>
                alert "Something went wrong while adding contact"

    fetch: ->
        @$(".contact").remove()
        @collection.fetch()
