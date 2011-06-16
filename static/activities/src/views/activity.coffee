## Activity

# Activity is the widget representation of an Activity
class ActivityRow extends Backbone.View

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
    <a href="#" class="doc-ref">
    <span class="activity-verb"><%= docType %></span>
    </a>
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
    "click .doc-ref": "onDocRefClicked"
    "click .activity-author": "onActivityAuthorClicked"
    "click .activity-error-number": "onErrorNumberClicked"
    "click .activity-error-resend": "onErrorResendClicked"


  # Constructor : register view and set HTML element id.
  constructor: (@model) ->
    super
    @id = @model.id
         
    @model.view = @
    
  ### Listeners ###


  # When mouse is over...
  onMouseOver: ->
    @


  # When mouse is out...
  onMouseOut: ->
    @
  

  onDocRefClicked: (event) ->
    if @model.getDocType() == "micropost"
        $.get("/news/micropost/" + @model.getDocId() + "/html/", (data) ->
          $("#activities-preview").html(data)
        )

    event.preventDefault()
    false


  onActivityAuthorClicked: (event) ->
    $.get("/contacts/render/" + @model.getAuthorKey() + "/", (data) ->
      $("#activities-preview").html(data)
    )

    event.preventDefault()
    false


  onErrorNumberClicked: (event) ->
    @$(".activity-errors").show()


  onErrorResendClicked: (event) ->
    if @model.getDocType() is "micropost"
      switch @model.getMethod()
        when "POST"
          $("#" + event.target.id).html("resending...")
          $.ajax(
            type: "POST"
            url: "/news/micropost/" + @model.getDocId()  + "/retry/"
            data: '{"contactId": "' + event.target.id + '", "activityId":"' + @model.id + '"}'
            dataType : "json"
            success: (data) ->
              $("#" + event.target.id).html("resending succeeds.")
            error: (data) ->
              infoDialog.display "Sending data fails again."
              $("#" + event.target.id).html("resend")
          )
        when "DELETE"
          
          extra = ""
          for error in @model.getErrors()
            if error.contactKey and error.contactKey is event.target.id
              extra = error.extra

          $("#" + event.target.id).html("resending...")
          $.ajax(
            type: "PUT"
            url: "/news/micropost/" + @model.getDocId()  + "/retry/"
            data: '{"contactId": "' + event.target.id + '", "activityId":"' + @model.id + '", "extra":"' + extra + '"}'
            dataType : "json"
            success: (data) ->
              $("#" + event.target.id).html("resending succeeds.")
            error: (data) ->
              infoDialog.display "Sending data fails again."
              $("#" + event.target.id).html("resend")
          )

  

  ### Functions ###


  # Builds activity row element from template and linked actvity data.
  # It sets the button jquery-ui behavior on delete button then it hides it.
  # It does not set element to DOM.
  render: ->
    if not @model.getDisplayDate()
      @model.setDisplayDate()

    $(@el).html(@template(@model.toJSON()))
    @$(".activity-errors").hide()
    @el


