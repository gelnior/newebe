
# Utility class to displays loading indicator.
class LoadingIndicator
    
  # Build loading indicator widget.
  constructor: () ->
    div = document.createElement('div')
    div.id = "loading-indicator"
    div.innerHTML = '<img src="/static/images/clock_32.png" />'
    $("body").prepend(div)
    @element = $("#loading-indicator")
    @element.hide()


   # Displays loading indicator on top right.
   display: () ->
     @element.show()
       

   # Hides loading indicator.
   hide: () ->
     @element.hide()
       
