## NoteView


# Main view for notes application
class NotesView extends Backbone.View
  el: $("#notes-list")


  ### Events ###

  events:
    "click #notes-new-button" : "onNewNoteClicked"
    "click #notes-sort-date-button" : "onSortDateClicked"
    "click #notes-sort-title-button" : "onSortTitleClicked"


  constructor: (controller) ->
    @controller = controller
    controller.registerView(@)
    super


  # Bind functions to view, initialize displayed collection and markdown
  # converter
  initialize: ->
    _.bindAll(@, 'onNewNoteClicked')
    _.bindAll(@, 'onRowClicked')
    _.bindAll(@, 'onSortDateClicked')
    _.bindAll(@, 'onSortTitleClicked')
    _.bindAll(@, 'addAll')
    _.bindAll(@, 'appendOne')
    _.bindAll(@, 'prependOne')
    _.bindAll(@, 'reloadNotes')

    @notes = new NoteCollection
    @converter = new Showdown.converter()
    
    @notes.bind('add', @prependOne)
    @notes.bind('refresh', @addAll)


  ### Listeners  ###

  # When new note button is clicked, a new note is created, saved, displayed
  # and finally selected.
  onNewNoteClicked: (event) ->
    now = new Date().toString("yyyy-MM-ddTHH:mm:ssZ")
    noteObject =
      "title": "New Note"
      "date": now
      "lastModified": now
      "content": ""

    note = new Note noteObject
    note.save("", success: (model, response) ->
        model.setId(response._id)
      )
    row = @prependOne(note)

    @onRowClicked(row)
    row.focusTitle()
    event

  # When a click occurs on a row it selects it.
  onRowClicked: (row) ->
    if @selection != undefined and @selection != row
      @selection.unselect()
      row.select()
      @selection = row
    else if @selection == undefined
      row.select()
      @selection = row

    @displayText(@selection)
        
  # When sort date button is clicked, it disable then notes are reloaded
  # from the service that sorts them by date.
  onSortDateClicked: ->
    window.location.hash = "#sort-date"
  
  sortNotesByDate: ->
    if @dateButton.button("option", "disabled") == false
      
      @dateButton.button("disable")
      @titleButton.button("enable")
      @notes.url = "/notes/all/order-by-date/"
      @reloadNotes()
   
  # When sort title button is clicked, it disable then notes are reloaded
  # from the service that sorts them by title.
  onSortTitleClicked: ->
    window.location.hash = "#sort-title"

  sortNotesByTitle: ->
    if not(@titleButton.button("option", "disabled") == true)
      @titleButton.button("disable")
      @dateButton.button("enable")
      @notes.url = "/notes/all/order-by-title/"
      @reloadNotes()


  ### Functions  ###

  # Create note list from data coming from server. 
  addAll: ->
    @notes.each(@appendOne)

    loadingIndicator.hide()
   
  # Appends *note* to the beginning of current note list (render it).
  appendOne: (note) ->
    row = new NoteRow note
    row.registerView(@)
    el = row.render()
    $("#notes-list").append(el)
    row

  # Prepends *note* to the beginning of current note list (render it).
  prependOne: (note) ->
    row = new NoteRow note
    row.registerView(@)
    el = row.render()
    $("#notes-list").prepend(el)
    row

  # Displays tutorial in the tutorial DIV element.
  displayTutorial: (index) ->
    $.get("/notes/tutorial/" + index + "/", (data) ->
      $("#tutorial-news").html(data)
    )

  # When sort date button is clicked, it disable then notes are reloaded
  # from the service that sorts them by date.
  onSortDateClicked: () ->
    if not(@dateButton.button("option", "disabled") == true)
      @dateButton.button("disable")
      @titleButton.button("enable")
      @notePreviewer.html(null)

      @notes.url = "/notes/all/order-by-date/"
      @reloadNotes()
   
  # When sort title button is clicked, it disable then notes are reloaded
  # from the service that sorts them by title.
  onSortTitleClicked: () ->
    if not(@titleButton.button("option", "disabled") == true)
      @titleButton.button("disable")
      @dateButton.button("enable")
      @notePreviewer.html(null)

      @notes.url = "/notes/all/order-by-title/"
      @reloadNotes()
 
  # Clears note list then reload all notes.
  reloadNotes: () ->
    loadingIndicator.display()
    @el.html(null)
    @notes.fetch()
    @notes

  # Display note row content text area value into the preview div element
  # after that markdown elements get converted to HTML.
  displayText: (row) ->
    @notePreviewer.html(null)
    html = @converter.makeHtml(row.getContent())
    @notePreviewer.html(html)


  ### UI Builders  ###

  
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    $("#notes-new-button").click((event) =>
      notesApp.onNewNoteClicked(event))
    $("#notes-sort-date-button").click((event) =>
      notesApp.onSortDateClicked(event))
    $("#notes-sort-title-button").click((event) =>
      notesApp.onSortTitleClicked(event))
    @
  

  # Build JQuery widgets.
  setWidgets: ->
    @titleButton = $("#notes-sort-title-button")
    @dateButton = $("#notes-sort-date-button")
    @newButton = $("#notes-new-button")
    @notePreviewer = $("#notes-preview")

    @titleButton.button()
    @dateButton.button()
    @titleButton.button("disable")
    @newButton.button()

    $("#notes-a").addClass("disabled")
