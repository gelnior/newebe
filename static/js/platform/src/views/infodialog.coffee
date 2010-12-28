
class InfoDialog
    
  constructor: () ->
    div = document.createElement('div')
    div.id = "info-dialog"
    div.innerHTML = "Test"

    $("body").prepend(div)
    @element = $("#info-dialog")
    @element.hide()


   display: (text) ->
     @element.empty()
     @element.append(text)
     @element.show()
     @element.fadeOut(4000)
       

