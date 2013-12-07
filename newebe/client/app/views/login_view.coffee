QuestionView = require './question_view'

module.exports = class LoginView extends QuestionView
    id: 'login-view'

    initialize: ->
        @question = "What is your sesame ?"
        @fieldId = "login-password"
        @type = "password"
        @fieldName = "password"
        @submitPath = 'login/json/'
        @render()

    onServerResponse: (err, data) =>
        if err then @field.val null
        else
            @field.animate {boxShadow: '0'}, =>
                Newebe.views.appView.displayHome()
