CollectionView = require '../lib/view_collection'
Contacts = require '../collections/contacts'
Contact = require '../models/contact'
ContactView = require './contact_view'
TagsView = require './tags_view'

request = require 'lib/request'

module.exports = class ContactsView extends CollectionView
    id: 'contacts-view'

    collection: new Contacts()
    view: ContactView

    events:
        'click #add-contact-button': 'onAddContactClicked'

    subscriptions:
        'tag:selected': 'onTagSelected'

    template: ->
        require './templates/contacts'

    afterRender: ->
        @isLoaded = false
        @newContactInput = @$ '#new-contact-field'
        @addContactButton = @$ '#add-contact-button'

        @configureRealTime()

    configureRealTime: ->
        protocol = ""
        if window.location.protocol is 'http:'
            protocol = 'ws'
        else if window.location.protocol is 'https:'
            protocol = 'wss'
        host = window.location.host
        path = "#{protocol}://#{host}/contacts/publisher/"

        @ws = new WebSocket path
        @ws.onmessage = (evt) =>

            # update contact list with new informations
            contact = new Contact JSON.parse evt.data
            previousContact = @collection.findWhere '_id': contact.get '_id'

            if previousContact?
                for view in @views
                    if view.model.cid is previousContact.cid
                        contactView = view
                if contactView?
                    @collection.remove previousContact
                    @destroy contactView
                    @renderOne contact, prepend: true
            else
                @renderOne contact

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
        button = $("#add-contact-button")

        if @checkUrl contactUrl
            @$('.error').html ""

            button.spin 'small'
            @collection.create data,
                success: (model) =>
                    button.spin()
                    model.set 'name', model.get 'url'
                    @renderOne model
                    @newContactInput.val null
                    @newContactInput.focus()
                error: =>
                    button.spin()
                    alert 'Something went wrong while adding contact'
                silent: true

    renderOne: (model) =>
        view = new @view model
        @$el.append view.render().el
        @add view

        if model.get("state") is "Trusted"
            for tag in @tagsView.collection.toArray()
                view.addTag tag
        @

    fetch: ->
        @$('.contact').remove()
        unless @tagsView?
            @tagsView = new TagsView el: '#tag-list'
            @tagsView.contactsView = @
        @tagsView.$el.spin 'small'
        @tagsView.fetch
            success: =>
                @tagsView.$el.spin()
                @$el.spin 'small'
                @collection.fetch
                    success: =>
                        @$el.spin()
                    error: =>
                        @$el.spin()

            error: =>
                alert "an error occured"
        @isLoaded = true

    onTagSelected: (name) ->
        if @tagsView?
            @tagsView.select name
        if name is 'all' then @$('.contact-line').show()
        else
            @$('.contact-line').hide()
            @$(".filter-#{name}").show()

    onTagDeleted: (name) ->
        @$(".contact-line").removeClass "tag-#{name}"
        @$(".tag-#{name}").remove()

    onTagAdded: (tag) =>
        for view in @views when view.model.get('state') is 'Trusted'
            view.addTag tag
