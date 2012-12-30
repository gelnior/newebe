AppView = require 'views/app_view'

describe "Register", ->
    
    before ->
        window.Newebe = {}
        window.Newebe.routers = {}
        window.Newebe.views = {}
        window.Newebe.views.appView = new AppView()
        @mainView = window.Newebe.views.appView
        @mainView.render()

    it 'When I connect and no user is registered', (done) ->
        data =
            authenticated: false
            user: false
            password: false

        @mainView.start data
        setTimeout done, 1000

    it 'Then it displays name page', ->
        expect(@mainView.$("#register-name-view").is(":visible")).to.be.ok

    it 'When I submit my name', (done) ->
        @mainView.registerNameView.field.val "Jhon Doe"
        $.ajax = (options) -> options.success({})
        @mainView.registerNameView.onSubmit()
        setTimeout done, 1000

    it 'Then it displays password page', ->
        console.log @mainView.home.html()
        
        expect(@mainView.$("#register-password-view").is(":visible")).to.be.ok

    it 'When I submit my password', ->
        @mainView.registerView.passwordField.val "Jhon Doe"
        @mainView.registerView.onSubmitPassword()
        
    it 'Then it displays activity page', ->
        expect($("#acitivity-list").is(":visible")).to.be.ok

describe "Login", ->

    it 'When I connect and an user is registered', ->
        data =
            authenticated: false
            user: true
            password: true
        mainView.start data

    it 'Then it displays login page', ->
        expect($("#login-password").is(":visible")).to.be.ok

    it 'When I submit wrong password', ->
        @mainView.loginView.passwordField.val "wrong"
        @mainView.loginView.onPasswordSubmit()

    it 'Then it displays an error', ->
        expect($("#login-error").is(":visible")).to.be.ok

    it 'When I submit right password', ->
        @mainView.loginView.passwordField.val "right"
        @mainView.loginView.onPasswordSubmit()

    it 'Then it displays activity page', ->
        expect($("#acitivity-list").is(":visible")).to.be.ok
