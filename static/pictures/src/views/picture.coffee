## PictureRow

# PictureRow is the widget representation of a picture inside the list.
# It displays the picture thumbnail.
class PictureRow extends Backbone.View

  tagName: "div"
  className: "pictures-row"

  # HTML representation
  template:  _.template('''
    <a href="#" class="pictures-picture-author"><%= author %></a>
    <img src="<%= imgPath %>" alt="<%= title %>" />
    <p class="pictures-picture-date">
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

  # Show delete button and set "selected" style.
  select: ->
    $(@el).removeClass("mouseover")
    $(@el).addClass("selected")
    $("#news-preview").html(null)
    
  # Hide delete button and remove "selected" style.
  deselect: ->
    $(@el).removeClass("selected")
    $("#news-preview").html(null)
    

