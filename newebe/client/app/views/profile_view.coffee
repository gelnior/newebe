View = require '../lib/view'
Owner = require '../models/owner_model'

module.exports = class ProfileView extends View
    id: 'profile-view'

    template: ->
        require('./templates/profile')

    getRenderData: ->
        model: @model?.toJSON()

    render: ->
        @model = new Owner()
        @isLoaded = false

    fetch: ->
        unless @isLoaded
            @model.fetch
                success: =>
                    @setOwnerUrl() unless @model.get("url")?
                    @beforeRender()
                    @$el.html @template()(@getRenderData())
                    @afterRender()
                    @isLoaded = true
                    @
                error: =>
                    alert "something went wrong while retrieving profile."

    setOwnerUrl: =>
        @model.set 'url', "#{window.location.protocol}//#{window.location.host}/"
        @model.save()
