## PictureRow

# PictureRow is the widget representation of a picture inside the list.
# It displays the picture thumbnail.
class PictureRow extends Row

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
  # removed from view (a confirmation box is displayed before that).
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
 
  # Send a rotation request to the backend then reload preview.
  onRotateClicked: =>
    @model.rotatePicture (err) =>
      if err
        infoDialog.display "Server error ocurred."
      else
        infoDialog.display "Rotate succeeded. Reload page to see the result."


  # When download is clicked, full image is downloaded. Once download is 
  # finished the preview is reloaded.
  onDownloadClicked: (event) =>
    if event
      event.preventDefault()

    loadingIndicator.display()
    $.get(@model.getDownloadPath(), (data) =>
        if data.success
          @displayPreview()
        else
            loadingIndicator.hide()
          confirmationDialog.display(
            "An error occured while downloading image file.")
    )

  onPushNoteClicked: =>
    selectorDialogPicture.display (noteId) =>
      loadingIndicator.display()

      $.get "/notes/#{noteId}/", (note) =>
        note.content = note.content + "\n\n ![image](" + @model.getImagePreviewPath() + ")"

        $.putJson
          url: "/notes/#{noteId}/"
          body: note
          success: () ->
            infoDialog.display "note successfully updated"
            loadingIndicator.hide()
          error: () ->
            infoDialog.display "note update failed"
            loadingIndicator.hide()

  ### Functions ###


  # Removes micro post row element from DOM.
  remove: ->
    $(@el).remove()

  # Builds micro post row element from template and linked micro post data.
  # It sets the button jquery-ui behavior on delete button then it hides it.
  # It does not set element to DOM.
  render: ->
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

      $.get @model.getPath(), (data) =>
        loadingIndicator.hide()
        @preview.append(data)
        
        if $("#pictures-preview img").length > 0
            $("#pictures-preview").append("
            <p class=\"pictures-buttons button-bar\">
              <a id=\"pictures-rotate-button\">rotate</a>
              <a id=\"pictures-note-button\">push to note</a>
              <a href=\"#{@model.get('imgPath')}\" 
                 target=\"blank\"
                 id=\"pictures-full-size-button\">full-size</a>
              <a id=\"pictures-delete-button\">delete</a>
            </p>
            ")

            
        $("#pictures-note-button").click @onPushNoteClicked
        $("#pictures-delete-button").click @onDeleteClicked
        $("#pictures-rotate-button").click @onRotateClicked
        $("#pictures-download-button").click @onDownloadClicked
        $("#pictures-preview a").button()
        @preview.fadeIn()
        @updatePreviewPosition()
