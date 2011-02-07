### ContactRow is the widget representation of a Contact instance. ###

class ContactRow extends Backbone.View

  tagName: "div"
  className: "platform-contact-row"

  # HTML Template

  template:  _.template('''
    <span class="platform-contact-row-buttons">
    <% if (state === "Wait for approval") { %>
      <a class="platform-contact-wap">Confim</a>
    <% } %>
    <a class="platform-contact-delete">X</a>    
    </span>
    <p class="platform-contact-url">
     <%= url %> 
     <span class="platform-contact-state"> (<%= state %>)</span>
    </p>
  ''')

 # Events binding

  events:
    "click .platform-contact-delete": "onDeleteClicked"
    "click .platform-contact-wap": "onConfirmClicked"
    "mouseover" : "onMouseOver"
    "mouseout" : "onMouseOut"

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

  # When delete button is clicked, it will call the delete method of linked 
  # contact.
  onDeleteClicked: ->
    @model.delete()

  # When a contact is confirmed, it sends a POST request to the confirmation
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
  render: ->
    $(@el).html(@template(@model.toJSON()))
    @$(".platform-contact-delete").button()
    @$(".platform-contact-wap").button()
    @$(".platform-contact-row-buttons").hide()
    @el


