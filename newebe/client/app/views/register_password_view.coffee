QuestionView = require './question_view'
request = require '../lib/request'

module.exports = class RegisterPasswordView extends QuestionView
    id: 'register-password-view'

    initialize: ->
        @question = "Tell me your sesame"
        @fieldId = "register-password"
        @type = "password"
        @render()

    onSubmit: ->
        password = @field.val()

        if password.length > 0
            data = password: password,
            request.post 'register/password/', data, (err, data) ->
                Newebe.views.appView.displayActivities()
