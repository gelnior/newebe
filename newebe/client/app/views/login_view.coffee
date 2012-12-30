QuestionView = require './question_view'
request = require '../lib/request'

module.exports = class LoginView extends QuestionView
    id: 'login-view'

    initialize: ->
        @question = "What is your sesame ?"
        @fieldId = "login-password"
        @type = "password"
        @render()

    onSubmit: ->
        password = @field.val()

        if password.length > 0
            req = request.post 'login/json/', password: password, (err, data) =>
                if err
                    @field.val null
                else
                    Newebe.views.appView.displayActivities()
