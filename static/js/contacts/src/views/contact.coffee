### ContactRow is the widget representation of a Contact instance.
###

class ContactRow extends Backbone.View

  tagName: "div"
  className: "platform-contact-row"


  template:  _.template('''
    <a class="platform-contact-delete">X</a>
    <a class="platform-contact-resend">Resend</a>
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
    
  onMouseOver: ->
    @$(".platform-contact-delete").show()
    @$(".platform-contact-resend").show()

  # When mouse is out delete button is hidden.
  onMouseOut: ->
    @$(".platform-contact-delete").hide()
    @$(".platform-contact-resend").hide()

  # When delete button is clicked, it will call delete linked micro post method.
  onDeleteClicked: ->
    @model.delete()

  ## Removes micro post row element from DOM.
  remove: ->
    $(@el).remove()

  ## Builds micro post row element from template and linked micro post data.
  ## It sets the button jquery-ui behavior on delete button then it hides it.
  ## It does not set element to DOM.
  render: ->
    $(@el).html(@template(@model.toJSON()))
    @$(".platform-contact-delete").button()
    @$(".platform-contact-delete").hide()
    @$(".platform-contact-resend").button()
    @$(".platform-contact-resend").hide()
    @el


