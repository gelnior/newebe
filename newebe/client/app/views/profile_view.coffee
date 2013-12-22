View = require '../lib/view'
Owner = require '../models/owner_model'

class ProfileController

    constructor: (@view, @model) ->
        @model.isLoaded = false

    onProfileChanged: ->
        @model.save()

    onUploadComplete: ->
        @view.reloadPicture()

    onChangePasswordClicked: ->
        @view.displaySesameForm()

    onConfirmPasswordClicked: ->
        sesame = @getSesameFieldVal()
        @saveSesame(sesame) if sesame?

    getSesameFieldVal: =>
        sesame = @model.get "sesame"
        if sesame.length > 4
            sesame
        else
            @view.sesameForm.find('.error').html "New sesame is too short"
            @view.sesameForm.find('.error').fadeIn()
            null

    saveSesame: (sesame) ->
        @model.newSesame sesame, (err) =>
            console.log err
            if err
                @view.displaySesameError "A server error occured."
            else
                @view.displaySesameSuccess()
                setTimeout(=>
                    @view.displayChangePasswordButton()
                , 2000)

    onDataLoaded: ->
        @setOwnerUrl() unless @model.get("url")?
        @model.isLoaded = true

        @view.render()

    setOwnerUrl: =>
        url = "#{window.location.protocol}//#{window.location.host}/"
        @model.set 'url', url
        @model.save()


module.exports = class ProfileView extends View
    id: 'profile-view'

    events:
        "click #change-password-button": "onChangePasswordClicked"
        "click #confirm-password-button": "onConfirmPasswordClicked"
        "keyup #profile-name-field": "onProfileChanged"
        "keyup #profile-url-field": "onProfileChanged"
        "keyup #profile-sesame-field": "onNewSesameKeyUp"
        'mousedown .editable': 'editableClick'

    template: ->
        require('./templates/profile')

    getRenderData: ->
        model: @model?.toJSON()

    render: ->
        if @model?.isLoaded
            @beforeRender()
            @$el.html @template()(@getRenderData())
            @afterRender()
        else
            @model = new Owner()
            @controller = new ProfileController @, @model

    afterRender: ->
        @sesameForm = @$ "#sesame-form"
        @profileSesameField = @$ "#profile-sesame-field"
        @profileNameField = @$ "#profile-name-field"
        @profileUrlField = @$ "#profile-url-field"
        @model.bindField "name", @profileNameField
        @model.bindField "url", @profileUrlField
        @model.bindField "sesame", @profileSesameField

        @descriptionField = @$ "#profile-description"
        @converter = new Showdown.converter()
        if @model.get("description")?.length > 0
            @descriptionField.html @converter.makeHtml(@model.get('description'))
        else
            @descriptionField.html "your description"
        @descriptionField.keyup =>
            @model.set "description", toMarkdown(@descriptionField.html())
            @model.save()
        @model.bind 'save', =>
            @model.set "description", toMarkdown(@descriptionField.html())
            @model.save

        @passwordButton = @$ "#change-password-button"
        @confirmPasswordButton = @$ "#confirm-password-button"
        @pictureButton = @$ "#change-thumbnail-button"
        @profilePicture = @$ "#profile-picture"
        @fileUploader = new qq.FileUploader
            element: document.getElementById('change-picture-button')
            action: '/user/picture'
            allowedExtensions: ['jpg', 'jpeg', 'png']
            stylesheets: [""]
            debug: true
            mutliple: false
            onComplete: @onUploadComplete
        @

    onProfileChanged: => @controller.onProfileChanged()

    onUploadComplete: => @controller.onUploadComplete()

    onChangePasswordClicked: => @controller.onChangePasswordClicked()

    onConfirmPasswordClicked: => @controller.onConfirmPasswordClicked()

    onNewSesameKeyUp: (event) =>
        keyCode = event.keyCode
        keyCode ?= event.which
        if keyCode is 13
            @controller.onConfirmPasswordClicked()

    editableClick: etch.editableInit

    reloadPicture: ->
        now = new Date().getTime()
        @profilePicture.attr "src", "user/picture.jpg?date=#{now}"
        true

    displaySesameForm: ->
        @passwordButton.fadeOut =>
            @sesameForm.find('.error').hide()
            @sesameForm.find('.success').hide()
            @sesameForm.fadeIn =>
                @profileSesameField.focus()

    displayChangePasswordButton: ->
        @profileSesameField.val null
        @sesameForm.fadeOut =>
            @passwordButton.fadeIn()

    hideSesameInfos: ->
        @sesameForm.find('.error').hide()
        @sesameForm.find('.success').hide()

    displaySesameError: (msg) ->
        @sesameForm.find('.error').html msg
        @sesameForm.find('.error').fadeIn()

    displaySesameSuccess: ->
        @sesameForm.find('.success').fadeIn()

    fetch: ->
        unless @model.isLoaded
            @model.fetch
                success: =>
                    @controller.onDataLoaded()
                    @

                error: =>
                    alert "something went wrong while retrieving profile."
