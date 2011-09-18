## MicroPostRow

# MicroPostRow is the widget representation of a MicroPost
class MicroPostRow extends Backbone.View

  tagName: "div"
  className: "news-micropost-row"

  # HTML representation
  template:  _.template('''
    <a class="news-micropost-delete">X</a>
    <a href="#" class="news-micropost-author"><%= author %></a>
    <%= contentHtml %>
    <p class="news-micropost-date">
     <%= displayDate %>     
    </p>
  ''')


  ### Events ###
  events:
    "click .news-micropost-delete": "onDeleteClicked"
    "mouseover" : "onMouseOver"
    "mouseout" : "onMouseOut"
    "click" : "onClick"
    "click .news-micropost-author": "onAuthorClicked"

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


  # When delete button is clicked, it displays a confirmation dialog box.
  # When deletion is confirmed, delete request is sent to server and micropost
  # is remove from current page.
  onDeleteClicked: ->
    model = @model
    confirmationDialog.display(
        "Are you sure you want to delete this post ?",
        =>
          confirmationDialog.hide()
          model.delete()
          @mainView.selectedRow = null
          $("#news-preview").html(null)
    )

  # When author name is clicked, its data are displayed in the preview zone.
  onAuthorClicked: (event) ->
    $.get("/contacts/render/" + @model.getAuthorKey() + "/", (data) ->
      $("#news-preview").html(data)
    )

    if event
      event.preventDefault()
    false

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
    @$(".news-micropost-delete").button()
    @$(".news-micropost-delete").hide()
    @el

  # Show delete button and set "selected" style.
  select: ->
    @$(".news-micropost-delete").show()
    $(@el).removeClass("mouseover")
    $(@el).addClass("selected")
    @onAuthorClicked(null)
    
  # Hide delete button and remove "selected" style.
  deselect: ->
    @$(".news-micropost-delete").hide()
    $(@el).removeClass("selected")
    $("#news-preview").html(null)
    
