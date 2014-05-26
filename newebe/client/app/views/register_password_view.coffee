QuestionView = require './question_view'
request = require '../lib/request'

module.exports = class RegisterPasswordView extends QuestionView
    id: 'register-password-view'

    initialize: ->
        @question = "Tell me your sesame"
        @fieldId = "register-password"
        @type = "password"
        @fieldName = "password"
        @submitPath = "register/password/"
        @render()

    onServerResponse: (err, data) =>
        if err
            alert "Something went wrong while registering your sesame." + \
                "Try it again."
        else
            @field.animate {boxShadow: '0'}, =>
                Newebe.views.appView.displayHome()
