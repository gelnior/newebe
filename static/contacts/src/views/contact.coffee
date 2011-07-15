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
     <%= name %> | 
     <%= url %>
     <span class="platform-contact-state"> (<%= state %>)</span>
    </p>
  ''')

 # Events binding

  events:
    "click .platform-contact-delete": "onDeleteClicked"
    "click .platform-contact-wap": "onConfirmClicked"
    "click .platform-contact-retry": "onRetryClicked"
    "mouseover": "onMouseOver"
    "mouseout": "onMouseOut"

  constructor: (@model) ->
    super
         
    @model.view = @


  ## Event listeners

  # When mouse is over a contact row buttons are displayed.
  onMouseOver: ->
    @$(".platform-contact-row-buttons").show()

  # When mouse goes out a contact row buttons are hidden.
  onMouseOut: ->
    @$(".platform-contact-row-buttons").hide()

  # When delete button is clicked, it displays a confirmation dialog box.
  # When deletion is confirmed, delete request is sent to server and contact
  # is remove from current page.
  onDeleteClicked: ->
    model = @model
    confirmationDialog.display(
        "Are you sure you want to delete this contact ?",
        ->
          confirmationDialog.hide()
          model.delete()
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


  ## Functions

  # Removes micro post row element from DOM.
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


