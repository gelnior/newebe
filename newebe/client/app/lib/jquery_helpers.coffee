# TODO: Check if JQuery selector is required
module.exports = ->

    window.alert = (msg) ->
        $('#alert-widget').html msg
        $('#alert-widget').show()
        setTimeout =>
            $('#alert-widget').fadeOut 2000
        , 500

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

