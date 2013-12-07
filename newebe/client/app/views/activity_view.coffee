View = require '../lib/view'
Renderer = require '../lib/renderer'
MicroPost = require '../models/micropost'

module.exports = class ActivityView extends View
    className: 'activity pl0'

    template: ->
        require './templates/activity'

    events:
        'click': 'onClicked'
        "click .activity-error-number": "onErrorNumberClicked"
        "click .activity-error-resend": "onErrorResendClicked"

    constructor: (@model) ->
        super()

    getRenderData: ->
        renderer = new Renderer()
        @model.set 'displayDate', renderer.renderDate @model.get 'date'
        model: @model?.toJSON()

    onClicked: ->
        $('.activity').removeClass 'selected'
        @$el.addClass 'selected'


    # When user click on number of errors, it displayed the list of errorfs
    # inside the activity line.
    onErrorNumberClicked: (event) ->
        @$(".activity-errors").show()

    # When error resend button is clicked it requests server to resend data
    # to the contact. If it it succeeds it marks the error as solved else
    # it displays an error message.
    onErrorResendClicked: (event) ->
        extra = ""
        for error in @model.get 'errors'
            if error.contactKey and error.contactKey is event.target.id
                extra = error.extra

        switch @model.get 'method'
            when "POST"
                @sendRetryRequest("POST",
                    "/microposts/" + @model.get('docId') + "/retry/",
                    event)


            when "DELETE"
                @sendRetryRequest("PUT",
                    "/microposts/" + @model.get('docId') + "/retry/",
                    event,
                    extra)

    # Requests server to resend data to the contact.
    # If it it succeeds it marks the error as solved else it displays an error
    # message.
    #
    # Arguments :
    # * type is the request method (POST, PUT...).
    # * path is the path where request must be sent.
    # * event is the event which causes the retry.
    # * extra are the extra data needed.
    sendRetryRequest: (type, path, event, extra) ->
        $(event.target).html "resending..."
        $.ajax
            type: type
            url: path
            data: '{"contactId": "' + event.target.id + \
                  '", "activityId":"' + @model.id + \
                  '", "extra":"' + extra + '"}'
            dataType : "json"
            success: (data) =>
                $(event.target).html("resending succeeded.")
            error: (data) =>
                alert "Sending data failed again."
                $(event.target).html "resend"
