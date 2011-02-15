
## InfoDialog

# Dialog used to display notification to user.
class InfoDialog
   
  # Constructor : builds HTML element, then hides it.
  constructor: () ->
    div = document.createElement('div')
    div.id = "info-dialog"
    div.innerHTML = "Test"

    $("body").prepend(div)
    @element = $("#info-dialog")
    @element.hide()


   # Displays info dialog with givent *text*.
   display: (text) ->
     @element.empty()
     @element.append(text)
     @element.show()
     @element.fadeOut(4000)
       

