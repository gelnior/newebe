class Row extends Backbone.View

  # Update preview position depending on the actual window scroll position.
  updatePreviewPosition: () ->
    top = $("body").scrollTop()

    if top > 50
      top = top + 20
    else
      top = top + 60

    left = @preview.offset().left
    @preview.offset({left: left, top: top})


