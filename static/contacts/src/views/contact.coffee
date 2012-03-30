## Contact Row

# ContactRow is the widget representation of a Contact instance.

class ContactRow extends Backbone.View

  tagName: "div"
  className: "platform-contact-row"

  # HTML Template

  template:  _.template('''
    <span class="platform-contact-row-buttons">
    <% if (state === "Wait for approval") { %>
      <a class="platform-contact-wap">Confim</a>
    <% } %>
    <a class="platform-contact-retry">Retry</a>
    <a class="platform-contact-delete">X</a>    
    </span>
    <p class="platform-contact-url">
     <a class="contact-name" href=""><%= name %></a> | 
     <%= url %>
     <span class="platform-contact-state"> (<%= state %>)</span>
    </p>
  ''')

 # Events binding

  events:
    "click .platform-contact-delete": "onDeleteClicked"
    "click .platform-contact-wap": "onConfirmClicked"
    "click .platform-contact-retry": "onRetryClicked"
    "click .contact-name": "onNameClicked"
    "click" : "onClick"
    "mouseover": "onMouseOver"
    "mouseout": "onMouseOut"

  constructor: (@model, @mainView) ->
    super()
         
    @model.view = @


  ## Event listeners

  # When mouse is over a contact row buttons are displayed.
  onMouseOver: ->
    if not @selected
      $(@el).addClass("mouseover")

  # When mouse goes out a contact row buttons are hidden.
  onMouseOut: ->
    $(@el).removeClass("mouseover")

  # When row is clicked, it is selected : background changes and
  # buttons are displayed. Previously selected row is deselected.
  # This is handled by the main view.
  onClick: ->
    @mainView.onRowClicked(@)

  # When delete button is clicked, it displays a confirmation dialog box.
  # When deletion is confirmed, delete request is sent to server and contact
  # is remove from current page.
  onDeleteClicked: ->
    model = @model
    confirmationDialog.display(
      "Are you sure you want to delete this contact ?",
      =>
        confirmationDialog.hide()
        model.delete()
        @mainView.selectedRow = null
        $("#contact-preview").html(null)
    )

  # When retry button is clicked, adding contact request is sent to server.
  # On success, contact state is set to pending.
  onRetryClicked: ->
    $.ajax(
      type: "POST"
      url: "/contacts/" + @model.id + "retry/"
      data: '{"slug":"' + @model.slug + '"}'
      dataType : "json"
      success: (data) =>
        @model.state = "PENDING"
        @$(".platform-contact-state").html("(Pending)")
      error: (data) ->
        infoDialog.display "Contact request failed."
    )

  # When a contact is confirmed, it sends a PT request to the confirmation
  # service.
  onConfirmClicked: ->
    @model.saveToDb()

  # When author name is clicked, its data are displayed in the preview zone.
  onNameClicked: (event) ->
    $.get("/contacts/#{@model.get("key")}/html/", (data) ->
      $("#contact-preview").html(data)
    )
    if event
      event.preventDefault()
    false
  ## Functions

  # Removes contact row element from DOM.
  remove: ->
    $(@el).remove()

  # Refresh displayed data with model data.
  refresh: (state) ->
    @.$(".platform-contact-state").text("(" + state + ")")

  # Builds contact row element from template and linked micro post data.
  # It sets the buttons jquery-ui behavior on utility links then it hides 
  # them. It does not set element to DOM.
  # It hides retry button when it is not needed.
  render: ->
    $(@el).html(@template(@model.toJSON()))
    @$(".platform-contact-delete").button()
    @$(".platform-contact-retry").button()
    @$(".platform-contact-wap").button()
    @$(".platform-contact-row-buttons").hide()
    state = @model.getState()
    if state != "Error" and state != "pending"
      @$(".platform-contact-retry").hide()
    @el


  # Show delete button and set "selected" style.
  select: ->
    @$(".platform-contact-row-buttons").show()
    $(@el).removeClass("mouseover")
    $(@el).addClass("selected")
    @onNameClicked(null)
    
  # Hide delete button and remove "selected" style.
  deselect: ->
    @$(".platform-contact-row-buttons").hide()
    $(@el).removeClass("selected")
    $("#contact-preview").html(null)
