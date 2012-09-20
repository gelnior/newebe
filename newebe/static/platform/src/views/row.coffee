class Row extends Backbone.View

  # Update preview position depending on the actual window scroll position.
  updatePreviewPosition: () ->
    top = $("html").scrollTop()
    console.log top

    if top > 50
      top = top + 20
    else
      top = top + 60

    left = @preview.offset().left
    console.log left
    console.log top
    console.log @preview
    @preview.offset({left: left, top: top})



# Simplify put request with jquery.
$.putJson = (options) ->
    $.ajax
      type: "PUT"
      url: options.url
      dataType: "json"
      data: JSON.stringify(options.body)
      success: options.success
      error: options.error

