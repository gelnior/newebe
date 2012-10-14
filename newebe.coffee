$(() ->
    $('#install').hide()
    $('#documentation').hide()
    $('#contact').hide()
    $('#developers').hide()
    $('#faq').hide()
    lastSelected = $('#home')
    lastSelectedMenu = $('#menu-home')
    lastSelectedMenu.addClass('selected')

    displayInstall = (event) ->
        displayPage 'install'
    
    $('#menu-install').click displayInstall
    $('#download-text').click displayInstall

    onMenuElementClicked = (event) =>
        page = event.target.id.substring(5)
        displayPage(page)

    displayPage = (page) =>
        lastSelectedMenu.removeClass('selected')
        lastSelectedMenu = $("#menu-#{page}")
        lastSelectedMenu.addClass('selected')
        lastSelected.fadeOut 300, () ->
            $("##{page}").fadeIn(300)
        lastSelected = $("##{page}")

    $('#menu-home').click onMenuElementClicked
    $('#menu-faq').click onMenuElementClicked
    $('#menu-documentation').click onMenuElementClicked
    $('#menu-contact').click onMenuElementClicked
    $('#menu-developers').click onMenuElementClicked
    
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
