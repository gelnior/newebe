View = require '../lib/view'
AppRouter = require '../routers/app_router'
ActivitiesView = require './activities_view'
MicropostsView = require './microposts_view'
ContactsView = require './contacts_view'
ProfileView = require './profile_view'
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

    # Transmit logout user request to backend.
    onLogoutClicked: (event) ->
        request.get 'logout/', (err, data) =>
            if err
                alert "Something went wrong while logging out"
            else
                @displayLogin()

    onMicropostsClicked: -> @changeSubView @micropostsView

    onActivitiesClicked: -> @changeSubView @activitiesView

    onContactsClicked: -> @changeSubView @contactsView

    displayProfile: => @changeSubView @profileView

    displayActivities: => @changeSubView @activitiesView

    displayHome: =>
        showHome = =>
            @displayMenu()
            @displayActivities()

        if @currentView?
            @currentView.fadeOut showHome
        else
            showHome()

    displayRegisterPassword: => @changeView @registerPasswordView

    displayRegisterName: => @changeView @registerNameView

    displayLogin: => @changeView @loginView

    displayMenu: =>
        @menu.removeClass 'hidden'
        @menu.fadeIn()

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

    # Display a page corresponding to user state.
    start: (userState, callback) ->
        @home = @$ '#home'
        @menu = @$ "#navigation"
        @home.html null

        @loginView = @_addView LoginView
        @registerNameView = @_addView RegisterNameView
        @registerPasswordView = @_addView RegisterPasswordView
        @activitiesView = @_addView ActivitiesView
        @contactsView = @_addView ContactsView
        @profileView = @_addView ProfileView
        @micropostsView = @_addView MicropostsView
        
        if userState.authenticated
            if callback?
                callback()
            else
                @displayHome()
                @activitiesView.fetch()
        else if userState.password
            @displayLogin()
        else if userState.registered
            @displayRegisterPassword()
        else
            @displayRegisterName()

        @isLoaded = true

    _addView: (viewClass) =>
        view= new viewClass()
        view.hide()
        @home.append view.el
        view


    displayView: (view) =>
        showView = =>
            view.fetch() if view.fetch?
            @changeView view, =>
                @menu.removeClass 'hidden'
                @menu.fadeIn()

        if @isLoaded
            displayView()
        else
            @checkUserState showView

    changeSubView: (subView, callback) =>
        @changeMenuState subView
        showView = =>
            subView.fadeIn()
            @currentSubView = subView
            if not @currentSubView.isLoaded and @currentSubView.fetch?
                @currentSubView.fetch()
            callback() if callback?

        if @currentSubView?
            @currentSubView.fadeOut showView
        else
            showView()

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

    changeMenuState: (view) =>
        @$("#navigation").find("a").removeClass "active"
        if view is @activitiesView
            @$("#activities-button").addClass "active"
        else if view is @contactsView
            @$("#contacts-button").addClass "active"
        else if view is @micropostsView
            @$("#microposts-button").addClass "active"
        else if view is @profileView
            @$("#profile-button").addClass "active"
