# TODO: Check if JQuery selector is required
module.exports = ->
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

