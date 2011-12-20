## NoteRow

# NoteRow is the widget representation of a note.
class NoteRow extends Row

  tagName: "div"
  className: "notes-note-row"

  # HTML representation
  template:  _.template('''
    <a class="notes-note-delete">X</a>
    <a class="notes-note-edit">edit</a>
    <input class="notes-note-title" type="text" value="<%= title %>" />
    <p class="news-micropost-date">
     <%= displayDate %> 
    </p>
    <div class="spacer"></div>
    <textarea class="notes-note-content"><%= content%> </textarea>
  ''')


  ### Events ###

  events:
    "click .notes-note-delete": "onDeleteClicked"
    "click .notes-note-edit": "onEditClicked"
    "keyUp .notes-note-title": "onTitleKeyUp"
    "mouseover" : "onMouseOver"
    "mouseout" : "onMouseOut"
    "click": "onRowClicked"

  # Constructor : register view and set HTML element id.
  constructor: (@model) ->
    super()
    @id = @model.id
         
    @model.view = @
    @selected = false
    @preview = $("#notes-preview")
    

  ### Listeners ###

  # When row is clicked, main view is notified.
  onRowClicked: (event) ->
    @view.onRowClicked(@)

  # When mouse is over...
  onMouseOver: ->
    if not @selected
      @titleField.addClass("mouseover")
      $(@el).addClass("mouseover")

  # When mouse is out...
  onMouseOut: ->
    @titleField.removeClass("mouseover")
    $(@el).removeClass("mouseover")

  # When title is typed, model is updated then saved to services backend.
  onTitleKeyUp: (event) ->
    @model.setTitle(@titleField.val())
    @model.save()

  # When content is type, model is updated then saved to services backend.
  onContentKeyUp: (event) ->
    @model.setContent(@contentField.val())
    @view.displayText(@)
    @model.save()

  # When edit button is clicked,
  onEditClicked: (event) ->
    if @contentField.is(":hidden")
      @contentField.slideDown()
      @contentField.focus()
    else
      @contentField.slideUp()

  # When delete button is clicked, it displays a confirmation dialog box.
  # When deletion is confirmed, delete request is sent to server and micropost
  # is remove from current page.
  onDeleteClicked: ->
    confirmationDialog.display(
        "Are you sure you want to delete this note ?",
        =>
          confirmationDialog.hide()
          @model.delete()
    )


  ### Functions ###

  # Set selected style on current note. Show edit and delete button.
  select: () ->
    $(@el).addClass("selected")
    @titleField.addClass("selected")
    @deleteButton.show()
    @editButton.show()
    @selected = true

  # Remove selected style on current note. Hide edit and delete button.
  unselect: () ->
    $(@el).removeClass("selected")
    @titleField.removeClass("selected")
    @deleteButton.hide()
    @editButton.hide()
    @selected = false

  # Focus pointer on current note title.
  focusTitle: () ->
    @titleField.focus()

  # Register main view to row to notify when an event occurs.
  registerView: (view) ->
    @view = view

  # Return content text area value.
  getContent: () ->
    @contentField.val()

  # Removes note row element from DOM.
  remove: ->
    $(@el).remove()

  # Builds note row element from template and display note data.
  # It sets the button jquery-ui behavior on buttons then it hides them.
  # Set listeners on current note row.
  render: ->
    if not @model.getDisplayDate()
      @model.setDisplayDate()

    $(@el).html(@template(@model.toJSON()))
    @deleteButton = @$(".notes-note-delete")
    @editButton = @$(".notes-note-edit")
    @titleField = @$(".notes-note-title")
    @contentField = @$(".notes-note-content")

    @deleteButton.button()
    @editButton.button()
    @deleteButton.hide()
    @editButton.hide()
    @contentField.hide()
    
    @setListeners()

  # Set listeners to react when someone interact with current note row.
  setListeners: () ->
    @titleField.keyup((event) => @onTitleKeyUp(event))
    @contentField.keyup((event) => @onContentKeyUp(event))
    @$(".notes-note-row").click((event) => @onRowClicked(event))
    @el


