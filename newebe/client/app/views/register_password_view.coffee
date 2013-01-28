QuestionView = require './question_view'
request = require '../lib/request'

module.exports = class RegisterPasswordView extends QuestionView
    id: 'register-password-view'

    initialize: ->
        @question = "Tell me your sesame"
        @fieldId = "register-password"
        @type = "password"
        @fieldName = "password"
        @submitPath = "registerPassword"
        @render()

    onServerResponse: (err, data) ->
        # TODO: Handle error case
        Newebe.views.appView.displayHome()
