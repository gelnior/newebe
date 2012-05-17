$(() ->
    $('#installation').hide()
    $('#documentation').hide()
    $('#contact').hide()
    $('#developers').hide()
    lastSelected = $('#home')
    lastSelectedMenu = $('#menu-home')
    lastSelectedMenu.addClass('selected')

    $('#menu-home').click((event) ->
        lastSelected.fadeOut(300, () ->
            $('#home').fadeIn(500)
        )
        lastSelected = $('#home')
        lastSelectedMenu.removeClass('selected')
        lastSelectedMenu = $('#menu-home')
        lastSelectedMenu.addClass('selected')
    )
    displayInstall = (event) ->
        lastSelected.fadeOut(300, () ->
            $('#installation').fadeIn(500)
        )
        lastSelected = $('#installation')
        lastSelectedMenu.removeClass('selected')
        lastSelectedMenu = $('#menu-installation')
        lastSelectedMenu.addClass('selected')
    
    $('#menu-installation').click displayInstall
    $('#download-text').click displayInstall

    $('#menu-documentation').click((event) ->
        lastSelected.fadeOut(300, () ->
            $('#documentation').fadeIn(300)
        )
        lastSelected = $('#documentation')
        lastSelectedMenu.removeClass('selected')
        lastSelectedMenu = $('#menu-documentation')
        lastSelectedMenu.addClass('selected')
    )
    $('#menu-contact').click((event) ->
        lastSelected.fadeOut(300, () ->
            $('#contact').fadeIn(300)
        )
        lastSelected = $('#contact')
        lastSelectedMenu.removeClass('selected')
        lastSelectedMenu = $('#menu-contact')
        lastSelectedMenu.addClass('selected')
    )
    $('#menu-developers').click((event) ->
        lastSelected.fadeOut(300, () ->
            $('#developers').fadeIn(300)
        )
        lastSelected = $('#developers')
        lastSelectedMenu.removeClass('selected')
        lastSelectedMenu = $('#menu-developers')
        lastSelectedMenu.addClass('selected')
    )

    url = document.location.href
    if url and url.indexOf("#") > 0
        path = url.split("#")[1]
        element = "#" + path

        $('#home').hide()
        $(element).show()
        
        lastSelected = $(element)
        lastSelectedMenu.removeClass('selected')
        lastSelectedMenu = $('#menu-' + path)
        lastSelectedMenu.addClass('selected')
)

