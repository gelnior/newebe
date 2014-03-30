$ ->
    onMenuElementClicked = (event) =>
        page = event.target.id.substring(5)
        displayPage(page)

    displayPage = (page) =>
        @lastSelectedMenu.removeClass('selected')
        @lastSelectedMenu = $("#menu-#{page}")
        @lastSelectedMenu.addClass('selected')
        @lastSelected.fadeOut 300, () ->
            $("##{page}").fadeIn(300)
        @lastSelected = $("##{page}")

    if $(window).width() > 760
        $('#install').hide()
        $('#documentation').hide()
        $('#contact').hide()
        $('#developers').hide()
        $('#demo').hide()
        $('#faq').hide()
    $('#download-text').click (event) ->
      displayPage 'install'

    $('#menu-home').click onMenuElementClicked
    $('#menu-install').click onMenuElementClicked
    $('#menu-faq').click onMenuElementClicked
    $('#menu-documentation').click onMenuElementClicked
    $('#menu-contact').click onMenuElementClicked
    $('#menu-developers').click onMenuElementClicked
    $('#menu-demo').click onMenuElementClicked
    $('#install-button').click -> displayPage 'install'
    $('#demo-button').click -> displayPage 'demo'

    url = document.location.href
    if url and url.indexOf("#") > 0
        path = url.split("#")[1]
        element = "#" + path

        $('#home').hide()
        $(element).show()

        @lastSelected = $(element)
        @lastSelectedMenu = $('#menu-' + path)
    else
        @lastSelected = $('#home')
        @lastSelectedMenu = $('#menu-home')
    @lastSelectedMenu.addClass('selected')
