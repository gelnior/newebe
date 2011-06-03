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
        <%= error.contactUrl %> -> 
        <span id="error.contactKey">resend</span>
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
        $.get("/news/microposts/" + @model.getDocId() + "/html/", (data) ->
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
    $(@id + ".activity-errors").show()

  ### Functions ###


  # Builds activity row element from template and linked acitvity data.
  # It sets the button jquery-ui behavior on delete button then it hides it.
  # It does not set element to DOM.
  render: ->
    if not @model.getDisplayDate()
        @model.setDisplayDate()

    $(@el).html(@template(@model.toJSON()))
    @el


