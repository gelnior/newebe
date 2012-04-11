## MicroPostRow

# MicroPostRow is the widget representation of a MicroPost
class MicroPostRow extends Row

  tagName: "div"
  className: "news-micropost-row"

  # HTML representation
  template:  _.template('''
    <a href="#" class="news-micropost-author"><%= author %></a>
    <%= contentHtml %>
    <p class="news-micropost-date">
     <%= displayDate %>     
    </p>
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
    @preview = $("#news-preview")
    
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


  # When delete button is clicked, it displays a confirmation dialog box.
  # When deletion is confirmed, delete request is sent to server and micropost
  # is remove from current page.
  onDeleteClicked: =>
    confirmationDialog.display(
        "Are you sure you want to delete this post ?",
        =>
          confirmationDialog.hide()
          @model.delete()
          @mainView.selectedRow = null
          @clearPreview()
      )


  # When note is pushed, a selector is displayed. Then the note is retrieved
  # After that, its content is updated with current micropost content (added
  # to bottom) and note is saved.
  onPushNoteClicked: =>

    selectorDialog.display (noteId) =>
      loadingIndicator.display()

      $.get "/notes/#{noteId}/", (note) =>
        note.content = note.content + "\n\n" + @model.getContent()

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
    if not @model.getDisplayDate()
      @model.setDisplayDate()

    $(@el).html(@template(@model.toJSON()))
    @el

  # Removes everything in preview zone.
  clearPreview: ->
    $("#news-preview").html(null)

  # Show delete button and set "selected" style. Render post in preview.
  select: ->
    $(@el).removeClass("mouseover")
    $(@el).addClass("selected")

    $("#news-preview").html(null)
    @renderMicropost =>
      @checkForVideo()
      @checkForImage()
      @updatePreviewPosition()
    
  # Hide delete button and remove "selected" style. Clear preview.
  deselect: ->
    @$(".news-micropost-delete").hide()
    $(@el).removeClass("selected")
    @clearPreview()
 

  # Get html representation of micropost form server, then add buttons.
  renderMicropost: (callback) =>
    $.get "/microposts/#{@model.id}/html/", (data) =>
      @preview.append(data)
      
      $("#news-preview").append('''
        <p class="micropost-buttons button-bar">
          <a class="micropost-note-button">push to note</a>
          <a class="micropost-delete-button">delete</a>
        </p>
      ''')
      $(".micropost-buttons a").button()
      $(".micropost-note-button").click @onPushNoteClicked
      $(".micropost-delete-button").click @onDeleteClicked

      callback()

  # Check if post contains a youtube link. If it is the case,
  # it displays the embedded version of this video in the preview column.
  checkForVideo: ->
    # Remember we analyze markdown code, not displayed text.
    regexp = /\[.+\]\((http|https):\/\/\S*youtube.com\/watch\?v=\S+\)/g
    content = @model.get("content")
    urls = content.match(regexp)
    
    if urls
      $("#news-preview").append("<p>Embedded videos: </p>")

      for url in urls
        url = @getUrlFromMarkdown url

        res = url.match(/v=\S+&/)
        key = res[0] if res?

        if not key
          res = url.match(/v=\S+/)
          key = res[0] if res?

        if key
          if key.indexOf("&") > 0
            key = key.substring(2, key.length - 1)
          else
            key = key.substring(2, key.length)
  
          $("#news-preview").append("""
           <p>
             <iframe width="100%" height="315" 
               src="http://www.youtube.com/embed/#{key}" 
               frameborder="0" allowfullscreen>
             </iframe>
           </p>
          """)

  # Check if mircropost contains an image link. If it is the case,
  # it displays the image in the preview column.
  checkForImage: ->
    # Remember we analyze markdown code, not displayed text.
    regexp = /\[.+\]\((http|https):\/\/\S+\.(jpg|png|gif)\)/g
    content = @model.get("content")
    urls = content.match(regexp)
    
    if urls
      $("#news-preview").append("<p>Embedded pictures: </p>")

      for url in urls
        url = @getUrlFromMarkdown url

        if url
          $("#news-preview").append("""
            <p>
            <img style="max-width: 100%;"
                 src="#{url}"
                 alt="Micropost preview" />
            </img>
            </p>
          """)


  # Extract url from markdown styling : take string which is between parenthesis
  getUrlFromMarkdown: (markdownLink) ->
    index = markdownLink.indexOf("(")
    markdownLink.substring(index + 1, markdownLink.length - 1)
    

