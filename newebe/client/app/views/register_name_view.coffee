QuestionView = require './question_view'
request = require '../lib/request'

module.exports = class RegisterNameView extends QuestionView
    id: 'register-name-view'

    initialize: ->
        @question = "What is your name ?"
        @fieldId = "register-name"
        @type = "text"
        @fieldName = "name"
        @submitPath = "register/"
        @render()

    onServerResponse: (err, data) =>
        if err
            alert "Something went wrong while registering your name." + \
                "Try it again."
        else
            @field.animate {boxShadow: '0'}, =>
                Newebe.views.appView.displayRegisterPassword()
