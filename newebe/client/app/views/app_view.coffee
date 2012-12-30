View = require '../lib/view'
AppRouter = require '../routers/app_router'
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

    initialize: ->
        @router = Newebe?.routers.appRouter = new AppRouter()
        @activitiesView = new ActivitiesView()
        @loginView = new LoginView()
        @registerNameView = new RegisterNameView()
        @registerPasswordView = new RegisterPasswordView()

    events:
        'click #logout-button': 'onLogoutClicked'

    # Transmit logout user request to backend.
    onLogoutClicked: (event) ->
        request.get 'logout/', (err, data) =>
            if err
                alert "Something went wrong while logging out"
            else
                @displayLogin()

    # Depending on user state given by backend, it displays corresponding page.
    # State is described by following parameters :
    # * authenticated : if user is logged in or not.
    # * registered: if user is registered or not.
    # * password: if  user registered his password or not.
    checkUserState: ->
        request.get 'user/state/', (err, data) =>
            if err
                alert "Something went wrong, can't load newebe data."
            else
                @start data

    # Display a page corresponding to user state.
    start: (userState) ->
        @home = @$('#home')
        @menu = @$("#menu")

        if userState.authenticated
            @displayActivities()
            @activitiesView.collection.fetch()
        else if userState.password
            @displayLogin()
        else if userState.registered
            @displayRegisterPassword()
        else
            @displayRegisterName()

    displayActivities: =>
        @changeView @activitiesView, =>
            @menu.hide()
            @menu.removeClass 'hidden'
            @menu.fadeIn()

    displayLogin: =>
        @changeView @loginView

    displayRegisterPassword: =>
        @changeView @registerPasswordView

    displayRegisterName: =>
        @changeView @registerNameView

    # Little function to change current view in a smooth way by using fade in
    # and out effects.
    changeView: (view, callback) =>
        @menu.fadeOut() if view isnt @activitiesView
        @home.children().fadeOut =>
            @home.hide()
            @currentView.destroy if @currentView?
            @currentView = view
            @home.append view.$el
            view.$el.show()
            @home.fadeIn =>
                view.focusField() if view.focusField?
            callback() if callback?
