View = require '../lib/view'
AppRouter = require '../routers/app_router'
ActivitiesView = require './activities_view'
LoginView = require './login_view'
RegisterNameView = require './register_name_view'
RegisterPasswordView = require './register_password_view'

request = require 'lib/request'

module.exports = class AppView extends View
    el: 'body.application'

    events:
        'click #logout-button': 'onLogoutClicked'

    template: ->
        require('./templates/home')

    initialize: ->
        @router = Newebe?.routers.appRouter = new AppRouter()
        @activitiesView = new ActivitiesView()
        @loginView = new LoginView()
        @registerNameView = new RegisterNameView()
        @registerPasswordView = new RegisterPasswordView()

    checkUserState: ->
        request.get 'user/state/', (err, data) =>
            if err
                alert "Something went wrong, can't load newebe data."
            else
                @start data

    onLogoutClicked: (event) ->
        request.get 'logout/', (err, data) =>
            if err
                alert "Something went wrong while logging out"
            else
                @displayLogin()

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

    changeView: (view, callback) =>
        @menu.fadeOut() if view isnt @activitiesView
        @home.children().fadeOut =>
            @home.hide()
            @home.html view.$el
            view.$el.show()
            @home.fadeIn =>
                view.focusField() if view.focusField?
            callback() if callback?
