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

    # Add JQuery extensions
    $.fn.spin = (opts, color) ->
        presets =
            tiny:
                lines: 8
                length: 2
                width: 2
                radius: 3

            small:
                lines: 8
                length: 1
                width: 2
                radius: 5

            large:
                lines: 10
                length: 8
                width: 4
                radius: 8

        if Spinner
            @each ->
                $this = $(this)
                spinner = $this.data 'spinner'

                if spinner?
                    spinner.stop()
                    $this.css 'color', $this.data 'color'
                    $this.data 'spinner', null
                    $this.data 'color', null

                else if opts isnt false
                    color = $this.css 'color'
                    $this.data 'color', color
                    $this.css 'color', 'transparent'
                    if typeof opts is 'string'
                        if opts of presets then opts = presets[opts]
                        else opts = {}
                        opts.color = color if color
                    spinner = new Spinner(
                        $.extend(color: $this.css('color'), opts))
                    spinner.spin(this)
                    $this.data 'spinner', spinner

        else
            console.log 'Spinner class is not available'
