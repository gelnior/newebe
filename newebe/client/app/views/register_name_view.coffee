QuestionView = require './question_view'
request = require '../lib/request'

module.exports = class RegisterNameView extends QuestionView
    id: 'register-name-view'

    initialize: ->
        @question = "What is your name ?"
        @fieldId = "register-name"
        @type = "text"
        @render()

    onSubmit: ->
        name = @field.val()

        if name.length > 0
            request.post 'register/', name: name, (err, data) ->
                if err
                    alert "Something went wrong while registering your name."
                else
                    Newebe.views.appView.displayRegisterPassword()
