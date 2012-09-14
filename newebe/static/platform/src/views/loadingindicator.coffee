## LoadingIndicator

# Utility class to displays loading indicator (little clock on top right of the
# window).
class LoadingIndicator
    
  # Builds loading indicator widget.
  constructor: () ->

    if $("#loading-indicator").length == 0

      div = document.createElement('div')
      div.id = "loading-indicator"
      div.innerHTML = '<img src="/static/images/clock_32.png" alt="loading indicator" />'
      $("body").prepend(div)

    @element = $("#loading-indicator")
    @element.hide()


   # Displays loading indicator on top right.
   display: () ->
     @element.show()
       

   # Hides loading indicator.
   hide: () ->
     @element.hide()
       
