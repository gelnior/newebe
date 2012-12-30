View = require '../lib/view'

# Canvas for views with a single question like login or regsiter page.
module.exports = class QuestionView extends View

    getRenderData: ->
        return question: @question, type: @type, fieldId: @fieldId

    template: ->
        require('./templates/question')

    afterRender: ->
        @field = @$("##{@fieldId}")
        @field.keyup (event) =>
            @onSubmit() if event.which is 13

    onSubmit: ->
 
    focusField: ->
        @field.animate boxShadow: '4px 4px 10px #888'
        @field.focus()

