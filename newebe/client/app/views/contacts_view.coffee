CollectionView = require '../lib/view_collection'
Contacts = require '../collections/contacts'
ContactView = require './contact_view'

request = require 'lib/request'

module.exports = class ContactsView extends CollectionView
    id: 'contacts-view'

    collection: new Contacts()
    view: ContactView

    events:
        'click #add-contact-button': 'onAddContactClicked'

    template: ->
        require './templates/contacts'

    afterRender: ->
        @isLoaded = false

        @newContactInput = @$ '#new-contact-field'
        @addContactButton = @$ '#add-contact-button'

    isValidUrl: (string) ->
        regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g
        isValid = string.match(regexp) isnt null
        isValid

    checkUrl: (contactUrl) ->
        if contactUrl.indexOf('/', contactUrl.length - 1) is -1
            contactUrl += '/'


        if @collection.containsContact contactUrl
            @$('.error').html 'Contact is already in your list'
            false
        else if not @isValidUrl contactUrl
            @$('.error').html """
            Wrong URL, URL should look like https://newebe.mydomain.net/ or
            like https://87.123.21.13:12000/.
            """
            false
        else
            true
        
    onAddContactClicked: =>
        contactUrl = @newContactInput.val()
        data = url: contactUrl

        if @checkUrl contactUrl
            @$('.error').html ""

            @collection.create data,
                success: (model) =>
                    @renderOne model
                error: =>
                    alert 'Something went wrong while adding contact'

    fetch: ->
        @$('.contact').remove()
        @collection.fetch()
