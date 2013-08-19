# TODO: Check if JQuery selector is required
module.exports = ->
    window.alert = (msg) ->
        $('#widget-alert').html msg
        $('#widget-alert').show()
        setTimeout =>
            $('#widget-alert').fadeOut()
        , 1000


    $.fn.disable = ->
        @each ->
            $(@).prop 'disabled', true
            $(@).addClass 'disabled'

    $.fn.enable = ->
        @each ->
            $(@).prop 'disabled', false
            $(@).removeClass 'disabled'

    $.fn.select = ->
        @each ->
            $(@).addClass 'selected'

    $.fn.unselect = ->
        @each ->
            $(@).removeClass 'selected'

