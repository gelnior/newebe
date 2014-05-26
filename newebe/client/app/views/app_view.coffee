View = require '../lib/view'
AppRouter = require '../routers/app_router'
MicropostsView = require './microposts_view'
ContactsView = require './contacts_view'
NotesView = require './notes_view'
PicturesView = require './pictures_view'
CommonsView = require './commons_view'
ProfileView = require './profile_view'
ActivitiesView = require './activities_view'
LoginView = require './login_view'
RegisterNameView = require './register_name_view'
RegisterPasswordView = require './register_password_view'

request = require 'lib/request'

# Main application view, that's here where we manage all other views.
# It handles the navigation menu too.
module.exports = class AppView extends View
    el: 'body.application'

    template: ->
        require('./templates/home')

    events:
        'click #logout-button': 'onLogoutClicked'
        'click #responsive-menu': 'onResponsiveMenuClicked'

    # Depending on user state given by backend, it displays corresponding page.
    # State is described by following parameters :
    # * authenticated : if user is logged in or not.
    # * registered: if user is registered or not.
    # * password: if  user registered his password or not.
    checkUserState: (callback) ->
        request.get 'user/state/', (err, data) =>
            if err
                alert "Something went wrong, can't load newebe data."
            else
                @start data, callback

    # Transmit logout user request to backend.
    onLogoutClicked: (event) ->
        request.get 'logout/', (err, data) =>
            if err
                alert "Something went wrong while logging out"
            else
                Newebe.routers.appRouter.navigate ''
                @displayLogin()

    onResponsiveMenuClicked: ->
        @$('#navigation ul').slideToggle()


    # Display a page corresponding to user state.
    start: (userState, callback) ->
        @home = @$ '#home'
        @menu = @$ "#navigation"
        @home.html null

        @loginView = @_addView LoginView
        @registerNameView = @_addView RegisterNameView
        @registerPasswordView = @_addView RegisterPasswordView
        @micropostsView = @_addView MicropostsView
        @picturesView = @_addView PicturesView
        @commonsView = @_addView CommonsView
        @contactsView = @_addView ContactsView
        @profileView = @_addView ProfileView
        @notesView = @_addView NotesView
        @activitiesView = @_addView ActivitiesView

        if userState.authenticated and callback? then callback()
        else if userState.authenticated
            @displayHome()
            @micropostsView.fetch()
        else if userState.password
            @displayLogin()
        else if userState.registered
            @displayRegisterPassword()
        else
            @displayRegisterName()

        @isLoaded = true

    onMicropostsClicked: -> @changeSubView @micropostsView
    onContactsClicked: -> @changeSubView @contactsView
    onPicturesClicked: -> @changeSubView @picturesView
    onCommonsClicked: -> @changeSubView @commonsClicked
    onNotesClicked: -> @changeSubView @notesView
    displayProfile: => @changeSubView @profileView
    displayMicroposts: =>
        @changeSubView @micropostsView
        @micropostsView.tagList?.fetch()

    displayHome: =>
        showHome = =>
            @displayMenu()
            @displayMicroposts()

        if @currentView? then @currentView.fadeOut showHome
        else showHome()

    displayMenu: =>
        @menu.removeClass 'hidden'
        @menu.fadeIn()

    displayRegisterPassword: => @changeView @registerPasswordView
    displayRegisterName: => @changeView @registerNameView
    displayLogin: =>
        @loginView.clearField()
        @changeView @loginView

    displayView: (view) =>
        showView = =>
            view.fetch() if view.fetch?
            @changeView view, =>
                @menu.removeClass 'hidden'
                @menu.fadeIn()

        if @isLoaded then displayView()
        else @checkUserState showView

    changeSubView: (subView, callback) =>
        if $(window).width() < 760
            @$('#navigation ul').slideUp()
        @changeMenuState subView
        if @currentSubView?
            @currentSubView.fadeOut =>
                @currentSubView = null
                @changeSubView subView, callback
        else
            subView.fadeIn()
            @currentSubView = subView
            if not @currentSubView.isLoaded and @currentSubView.fetch?
                @currentSubView.fetch()
            callback() if callback?

    # Little function to change current view in a smooth way by using fade in
    # and out effects.
    changeView: (view, callback) =>
        @currentView = view
        @menu.fadeOut()
        @home.children().fadeOut =>
            @home.hide()
            view.$el.show()
            @home.fadeIn =>
                view.focusField() if view.focusField?
            callback() if callback?

    _addView: (viewClass) =>
        view = new viewClass()
        view.hide()
        @home.append view.el
        view

    # Display corresponding menu button as selected for a given view.
    changeMenuState: (view) =>
        @$("#navigation").find("a").removeClass "active"
        if view is @micropostsView
            @$("#microposts-button").addClass "active"
            @$("#responsive-menu a").html 'news'
        else if view is @contactsView
            @$("#contacts-button").addClass "active"
            @$("#responsive-menu a").html 'contacts'
        else if view is @profileView
            @$("#profile-button").addClass "active"
            @$("#responsive-menu a").html 'profile'
        else if view is @notesView
            @$("#notes-button").addClass "active"
            @$("#responsive-menu a").html 'notes'
        else if view is @picturesView
            @$("#pictures-button").addClass "active"
            @$("#responsive-menu a").html 'pictures'
        else if view is @commonsView
            @$("#commons-button").addClass "active"
            @$("#responsive-menu a").html 'commons'
