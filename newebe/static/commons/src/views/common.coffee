## CommonRow

# CommonRow is the widget representation of a common inside the list.
# It displays the common thumbnail.
class CommonRow extends Row

  tagName: "div"
  className: "commons-row"

  # HTML representation
  template:  _.template('''
    <a href="#" class="commons-author"><%= author %></a>
    <p><%= path %></p>
    <p class="commons-date">
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
    @preview = $("#commons-preview")
    

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
        "Are you sure you want to delete this common ?", =>
          confirmationDialog.hide()
          @model.delete()
          @mainView.selectedRow = null
          @preview.fadeOut =>
            @preview.html(null)
    )

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

  # Set "selected" style. Then display preview of current common.
  select: ->
    $(@el).removeClass("mouseover")
    $(@el).addClass("selected")
    @displayPreview()
    
  # Remove "selected" style.
  deselect: ->
    $(@el).removeClass("selected")
    
  # Display preview common. It fades out initial preview then retrieve
  # preview rendered by server to display it after a fade in effect. 
  # Preview top position is updated with current body scroll position.
  displayPreview: ->
    @preview.fadeOut =>
      @preview.html(null)

      $.get @model.getPath(), (data) =>
        loadingIndicator.hide()
        @preview.append(data)
        
        console.log @model
        if @model.get "isFile"
            $("#commons-preview").append("
            <p class=\"commons-buttons button-bar\">
              <a href=\"#{@model.get('imgPath')}\" 
                 target=\"blank\"
                 id=\"commons-full-size-button\">download</a>
              <a id=\"commons-delete-button\">delete</a>
            </p>
            ")

            
            $("#commons-note-button").click @onPushNoteClicked
        $("#commons-delete-button").click @onDeleteClicked
        $("#commons-download-button").click @onDownloadClicked
        $("#commons-preview a").button()
        @preview.fadeIn()
        @updatePreviewPosition()
    

