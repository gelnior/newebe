## PictureRow

# PictureRow is the widget representation of a picture inside the list.
# It displays the picture thumbnail.
class PictureRow extends Backbone.View

  tagName: "div"
  className: "pictures-row"

  # HTML representation
  template:  _.template('''
    <a href="#" class="pictures-picture-author"><%= author %></a>
    <img src="<%= thumbnailPath %>" alt="<%= title %>" />
    <p class="pictures-picture-date">
     <%= displayDate %>
    </p>
    <div class="spacer"></div>
  ''')


  ### Events ###
  events:
    "mouseover" : "onMouseOver"
    "mouseout" : "onMouseOut"
    "click" : "onClick"

  # Constructor : register view and set HTML element id.
  constructor: (@model, @mainView) ->
    super()
    @id = @model.id
         
    @model.view = @
    @selected = false
    @preview = $("#pictures-preview")
    

  ### Listeners ###

  # When mouse is over background changes.
  onMouseOver: ->
    if not @selected
      $(@el).addClass("mouseover")

  # When mouse is out background comes back to normal.
  onMouseOut: ->
    $(@el).removeClass("mouseover")

  # When row is clicked, it is selected : background changes and delete
  # button is displayed. Previously selected row is deselected.
  # This is handled by the main view.
  onClick: ->
    @mainView.onRowClicked(@)

  # When delete button is clicked, the row is deleted from server then 
  # removed from view.
  onDeleteClicked: (event) =>
    if event
      event.preventDefault()

    confirmationDialog.display(
        "Are you sure you want to delete this picture ?", =>
          confirmationDialog.hide()
          @model.delete()
          @mainView.selectedRow = null
          @preview.fadeOut =>
            @preview.html(null)
    )


  ### Functions ###


  # Removes micro post row element from DOM.
  remove: ->
    $(@el).remove()

  # Builds micro post row element from template and linked micro post data.
  # It sets the button jquery-ui behavior on delete button then it hides it.
  # It does not set element to DOM.
  render: ->
    if not @model.getDisplayDate()
      @model.setDisplayDate()

    $(@el).html(@template(@model.toJSON()))
    @el

  # Set "selected" style. Then display preview of current picture.
  select: ->
    $(@el).removeClass("mouseover")
    $(@el).addClass("selected")
    @displayPreview()
    
  # Remove "selected" style.
  deselect: ->
    $(@el).removeClass("selected")
    
  # Display preview picture. It fades out initial preview then retrieve
  # preview rendered by server to display it after a fade in effect. 
  # Preview top position is updated with current body scroll position.
  displayPreview: ->
    @preview.fadeOut =>
      @preview.html(null)

      $.get "/pictures/" + @model.get("_id") + "/render/", (data) =>
        @preview.append(data)
        $("#pictures-delete-button").button()
        $("#pictures-delete-button").click(@onDeleteClicked)
        $("#pictures-full-size-button").button()
        @preview.fadeIn()
        @updatePreviewPosition()
    

  # Update preview position depending on the actual window scroll position.
  updatePreviewPosition: () ->
    top = $("body").scrollTop()

    if top > 50
      top = top + 20
    else
      top = top + 60

    left = @preview.offset().left
    @preview.offset({left: left, top: top})


