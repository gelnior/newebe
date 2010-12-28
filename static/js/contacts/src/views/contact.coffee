### ContactRow is the widget representation of a Contact instance.
###

class ContactRow extends Backbone.View

  tagName: "div"
  className: "platform-contact-row"


  template:  _.template('''
    <span class="platform-contact-row-buttons">
    <% if (state === "Wait for approval") { %>
      <a class="platform-contact-wap">Confim</a>
    <% } else { %>
      <a class="platform-contact-resend">Resend</a>
    <% } %>
    <a class="platform-contact-delete">X</a>    
    </span>
    <p class="platform-contact-url">
     <%= url %> 
     <span> (<%= state %>)</span>
    </p>
  ''')


  events:
    "click .platform-contact-delete": "onDeleteClicked"
    "mouseover" : "onMouseOver"
    "mouseout" : "onMouseOut"

  constructor: (@model) ->
    super
         
    @model.view = @
    
  # When mouse is over buttons are displayed.
  onMouseOver: ->
    @$(".platform-contact-row-buttons").show()

  # When mouse is out buttons are hidden.
  onMouseOut: ->
    @$(".platform-contact-row-buttons").hide()

  # When delete button is clicked, it will call delete linked contact method.
  onDeleteClicked: ->
    @model.delete()

  ## Removes micro post row element from DOM.
  remove: ->
    $(@el).remove()

  ## Builds contact row element from template and linked micro post data.
  ## It sets the buttons jquery-ui behavior on utility links then it hides 
  ## them. It does not set element to DOM.
  render: ->
    $(@el).html(@template(@model.toJSON()))
    @$(".platform-contact-delete").button()
    @$(".platform-contact-resend").button()
    @$(".platform-contact-wap").button()
    @$(".platform-contact-row-buttons").hide()
    @el


