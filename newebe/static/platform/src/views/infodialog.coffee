
## InfoDialog

# Dialog used to display notification to user.
class InfoDialog
   
  # Constructor : builds HTML element, then hides it.
  constructor: () ->

    if $("#info-dialog").length == 0

      div = document.createElement('div')
      div.id = "info-dialog"
      div.className = "dialog"

      $("body").prepend(div)

    @element = $("#info-dialog")
    @element.hide()


   # Displays info dialog with givent *text*.
   display: (text) ->
     @element.empty()
     @element.append(text)
     @element.show()
     @element.fadeOut(4000)
       

## Confirmation dialog

# Displays a confirmation dialog and runs given callback when yes button is 
# clicked.
class ConfirmationDialog

  # Constructor : builds HTML element, then hides it.
  constructor: ->
    
    if $("#confirmation-dialog").length == 0
      div = document.createElement('div')
      div.id = "confirmation-dialog"
      div.className = "dialog"
      div.innerHTML = '<div id="confirmation-text"></div>'
      div.innerHTML += '<div id="confirmation-buttons">'  \
        + '<span href="" id="confirmation-yes">Yes</span>' \
        + '<span href="" id="confirmation-no">No</span>' \
        + '</div>'
      $("body").prepend(div)

    @element = $("#confirmation-dialog")
    @element.hide()

    @setNoButton()


   # Hide when no button is clicked.
   setNoButton: ->
     divElement = @element
     $("#confirmation-no").click(
       () ->
         divElement.fadeOut()
         false
     )


   # Displays confirmation dialog with givent *text* and set callback function
   # on click event.
   display: (text, callback) ->
     $("#confirmation-text").empty()
     $("#confirmation-text").append('<span>' + text + '</span>')
     $("#confirmation-yes").click(callback)
     @element.show()
     top = $("body").scrollTop() + 200
     left = @element.offset().left
     @element.offset({left: left, top: top})
      

   # Hide confirmation dialog
   hide: ->
     @element.fadeOut()
