## MicroPostRow

# MicroPostRow is the widget representation of a MicroPost
class MicroPostRow extends Backbone.View

  tagName: "div"
  className: "news-micropost-row"

  # HTML representation
  template:  _.template('''
    <a class="news-micropost-delete">X</a>
    <span class="news-micropost-author"><%= author %></span>
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

  # Constructor : register view and set HTML element id.
  constructor: (@model) ->
    super
    @id = @model.id
         
    @model.view = @
    
  ### Listeners ###

  # When mouse is over delete button is shown.
  onMouseOver: ->
    @$(".news-micropost-delete").show()

  # When mouse is out delete button is hidden.
  onMouseOut: ->
    @$(".news-micropost-delete").hide()

  # When delete button is clicked, it displays a confirmation dialog box.
  # When deletion is confirmed, delete request is sent to server and micropost
  # is remove from current page.
  onDeleteClicked: ->
    model = @model
    confirmationDialog.display(
        "Are you sure you want to delete this post ?",
        ->
          confirmationDialog.hide()
          model.delete()
    )


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


