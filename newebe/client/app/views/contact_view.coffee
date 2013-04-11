View = require 'lib/view'

module.exports = class ContactView extends View
    className: 'contact-line clearfix'
    rootUrl: 'contacts/'

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
            succes: =>
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

    addTag: (tag) ->
        name = tag.get 'name'
        if name isnt "all"
            @$('.contact-tags').append "<button class=\"tag-#{name} contact-tag toggle-button\">#{tag.get "name"}</button>"
            tagView = @$el.find(".contact-tag").last()

            if tag.get("name") in @model.get "tags"
                tagView.addClass "selected"
                @$el.addClass "filter-#{name}"

            tagView.click =>
                tags = @model.get "tags"
                if tag.get("name") in @model.get "tags"
                    tagView.removeClass "selected"
                    tags = _.without(tags, tag.get "name")
                    @model.set "tags", tags
                else
                    @model.get("tags").push(tag.get "name")
                    tagView.addClass "selected"
                @model.save()
