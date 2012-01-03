## Activity

# Activity is the widget representation of an Activity
class ActivityRow extends Row

  tagName: "div"
  className: "activity-row"

  # HTML representation
  template:  _.template('''
    <span class="activity-date">
     <%= displayDate %> -
    </span>
    <a href="#" class="activity-author"><%= author %></a>
    <span class="activity-verb"><%= verb %></span>
    a
    <span class="doc-ref">
    <span class="activity-verb"><%= docType %></span>
    </span>
    <span class="activity-error-number">
    <%= errorNumber %>
    </span>
    <div class="activity-errors">
    Errors :
    <% _.each(errors, function(error) { %>
      <div class="activity-error">
        <%= error.contactName %> |
        <%= error.contactUrl %> ->
        <span id="<%= error.contactKey%>"
              class="activity-error-resend">
          resend
        </span>
    </div>
    <% }); %>
    </div>
  ''')


  ### Events ###


  events:
    "mouseover" : "onMouseOver"
    "mouseout" : "onMouseOut"
    "click" : "onClick"
    "click .doc-ref": "onDocRefClicked"
    "click .activity-author": "onActivityAuthorClicked"
    "click .activity-error-number": "onErrorNumberClicked"
    "click .activity-error-resend": "onErrorResendClicked"


  # Constructor : register view and set HTML element id.
  constructor: (@model, @mainView) ->
    super()
    @id = @model.id
         
    @model.view = @
    @selected = false
    @authorDisplayed = false
    @preview = $("#activities-preview")
    
  ### Listeners ###


  # When mouse is over, background changes.
  onMouseOver: ->
    if not @selected
      $(@el).addClass("mouseover")


  # When mouse is out, background comes back to normal.
  onMouseOut: ->
    $(@el).removeClass("mouseover")
    

  # When row is clicked, it is selected : background changes. 
  # Previously selected row is deselected.
  # This is handled by the main view.
  onClick: ->
    @mainView.onRowClicked(@)
      

  # When doc ref is clicked, if it is a micropost, micropost is displayed 
  # in the preview section, same for notes.
  onDocRefClicked: (event) ->
    if @model.getDocType() == "micropost" and @model.getMethod() == "POST"
        $.get "/news/micropost/" + @model.getDocId() + "/html/",  @onPreviewLoaded
    else if @model.getDocType() == "note"
        $.get "/notes/#{@model.getDocId()}/html/", @onPreviewLoaded
    
    else if @model.getDocType() == "picture" and @model.getMethod() == "POST"
        $.get "/pictures/#{@model.getDocId()}/render/", @onPreviewLoaded
            
        if event
          event.preventDefault()
    false


  onPreviewLoaded: (data) =>
    @preview.html(data)
    @updatePreviewPosition()


  # When activity author is clicked, the author profile is displayed.
  onActivityAuthorClicked: (event) =>
    if not @authorDisplayed
      $.get("/contacts/render/" + @model.getAuthorKey() + "/", (data) =>
        @preview.append("<p>&nbsp;</p>")
        @preview.append("<p>Author profile: </p>")
        @preview.append(data)
        @authorDisplayed = true
      )

    event.preventDefault()
    false


  # When user click on number of errors, it displayed the list of errorfs
  # inside the activity line.
  onErrorNumberClicked: (event) ->
    @$(".activity-errors").show()


  # When error resend button is clicked it requests server to resend data 
  # to the contact. If it it succeeds it marks the error as solved else  
  # it displays an error message.
  onErrorResendClicked: (event) ->
    if @model.getDocType() is "micropost"
      switch @model.getMethod()

        when "POST"
          @sendRetryRequest("POST",
                            "/news/micropost/" + @model.getDocId()  + "/retry/",
                            event)


        when "DELETE"
          extra = ""
          for error in @model.getErrors()
            if error.contactKey and error.contactKey is event.target.id
              extra = error.extra

          @sendRetryRequest("PUT",
                            "/news/micropost/" + @model.getDocId()  + "/retry/",
                            event,
                            extra)

  # Requests server to resend data to the contact. 
  # If it it succeeds it marks the error as solved else it displays an error 
  # message. 
  #
  # Arguments : 
  # * type is the request method (POST, PUT...).
  # * path is the path where request must be sent.
  # * event is the event which causes the retry.
  # * extra are the extra data needed.

  sendRetryRequest: (type, path, event, extra) ->
    $(event.target).html "resending..."
    $.ajax
      type: type
      url: path
      data: '{"contactId": "' + event.target.id + '", "activityId":"' + @model.id  + '", "extra":"' + extra + '"}'
      dataType : "json"
      success: (data) =>
        $(event.target).html("resending succeeds.")
      error: (data) =>
        infoDialog.display "Sending data fails again."
        $(event.target).html("resend")
    



  ### Functions ###


  # Builds activity row element from template and linked actvity data.
  # It does not set element to DOM.
  render: ->
    if not @model.getDisplayDate()
      @model.setDisplayDate()

    $(@el).html(@template(@model.toJSON()))
    @$(".activity-errors").hide()
    @el


  # Set "selected" style and displays activities data if needed.
  select: ->
    $(@el).removeClass("mouseover")
    $(@el).addClass("selected")
    $("#activities-preview").empty()
    @onDocRefClicked(null)
    
    
  # Hide delete button and remove "selected" style.
  deselect: ->
    $(@el).removeClass("selected")
    $("#news-preview").html(null)
    @authorDisplayed = false

