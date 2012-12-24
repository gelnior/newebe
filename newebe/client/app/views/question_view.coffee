View = require '../lib/view'

module.exports = class QuestionView extends View

    getRenderData: ->
        return question: @question, type: @type, fieldId: @fieldId

    template: ->
        require('./templates/question')

    focusField: ->
        @field.focus()

    afterRender: ->
        @field = @$("##{@fieldId}")
        @field.keyup (event) =>
            @onSubmit() if event.which == 13

    onSubmit: ->
