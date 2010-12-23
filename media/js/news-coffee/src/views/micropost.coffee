### MicroPostRow is the widget representation of a MicroPost
###

class MicroPostRow extends Backbone.View

  tagName: "div"
  className: "news-micropost-row" 


  template:  _.template('''
    <a class="news-micropost-delete">X</a>
    <p class="news-micropost-content">
     <span><%= author %></span>
     <%= content %>
    </p>
    <p class="news-micropost-date">
     <%= date%>
    </p>
  ''')


  events:
    "click .news-micropost-delete": "onDeleteClicked"
    "mouseover" : "onMouseOver"
    "mouseout" : "onMouseOut"

  constructor: (@model) ->
    super
    @id = "micropost-" + @model.id
         
    @model.view = @
    
  onMouseOver: ->
    @$(".news-micropost-delete").show()

  # When mouse is out delete button is hidden.
  onMouseOut: ->
    @$(".news-micropost-delete").hide()

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
    @$(".news-micropost-delete").button()
    @$(".news-micropost-delete").hide()
    @el


