# Write your [mocha](http://visionmedia.github.com/mocha/) specs here.

describe "Register", ->
    
    before ->
        @mainView = new MainView()

    it 'When I connect and no user is registered', ->
        data =
            authenticated: false
            user: false
            password: false
        mainView.start data

    it 'Then it displays name page', ->
        expect($("#register-name").is(":visible")).to.be.ok

    it 'When I submit my name', ->
        @mainView.registerView.nameField.val "Jhon Doe"
        @mainView.registerView.onSubmitName()

    it 'Then it displays password page', ->
        expect($("#register-password").is(":visible")).to.be.ok

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
