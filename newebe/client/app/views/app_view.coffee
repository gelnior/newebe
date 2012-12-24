View = require '../lib/view'
AppRouter = require '../routers/app_router'
ActivitiesView = require './activities_view'
LoginView = require './login_view'
RegisterNameView = require './register_name_view'
RegisterPasswordView = require './register_password_view'

request = require 'lib/request'

module.exports = class AppView extends View
    el: 'body.application'

    template: ->
        require('./templates/home')

    initialize: ->
        @router = Newebe.routers.appRouter = new AppRouter()
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

    start: (userState) ->
        @home = @$('#home')

        if userState.authenticated
            @displayActivities()
        else if userState.password
            @displayLogin()
        else if userState.registered
            @displayRegisterPassword()
        else
            @displayRegisterName()

    displayActivities: ->
        @home.html @activitiesView.$el

    displayLogin: ->
        @home.html @loginView.$el
        @loginView.focusField()

    displayRegisterPassword: ->
        @home.html @registerPasswordView.$el
        @registerPasswordView.focusField()

    displayRegisterName: ->
        @home.html @registerNameView.$el
        @registerNameView.focusField()
