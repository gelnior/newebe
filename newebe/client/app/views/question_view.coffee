View = require '../lib/view'
request = require '../lib/request'

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
        val = @field.val()
        if val.length > 0
            data = {}
            data[@fieldName] = val
            request.post @submitPath, data, @onServerResponse

    onServerResponse: (err, data) ->
 
    focusField: ->
        @field.animate boxShadow: '4px 4px 10px #888'
        @field.focus()

    clearField: ->
        @field.val ''
