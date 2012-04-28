
## DocumentSelector

# Dialog used to select a document
class DocumentSelector
   
  # Constructor : builds HTML element, then hides it.
  # Set listener on cancel button.
  constructor: ->
    if $("#document-selector") == undefined \
        or $("#document-selector").length == 0
      @createWidget()
      @setListeners()
    else
      @element = $("#document-selector")

    @docList = $("#document-selector-list")
    @element.hide()

  # Set widget inside DOM.
  createWidget: ->
    div = document.createElement('div')
    div.id = "document-selector"
    div.className = "dialog"
    $("body").prepend(div)

    @element = $("#document-selector")
    @element.html('''
        <div id="document-selector-buttons" class="dialog-buttons">
          <span id="document-selector-select">Select</span>
          <span id="document-selector-cancel">Cancel</span>
        </div>
        <div id="document-selector-toolbar">
        <div class="document-selector-select-wrapper">
        <select id="document-selector-type">
            <option label="Note" value="1">Note</option>
            <option label="Picture" value="1">Picture</option>
        </select>
        </div>
        <span id="document-selector-datepicker-label">until </span>
        <input type="text" id="document-selector-datepicker" />
        </div>
        <div id="document-selector-list">
        </div>
    ''')

  # Set listeners on document selector widget.
  setListeners: ->
    $("#document-selector-datepicker").datepicker
      onSelect : @onDatePicked
    $("#document-selector-datepicker").hide()
    $("#document-selector-datepicker-label").hide()

    $("#document-selector-cancel").click =>
      @element.fadeOut(400)
      
    $("#document-selector-type").change (event) =>
      type = $("#document-selector-type :selected").text()
      if type is "Picture"
        $("#document-selector-datepicker").show()
        $("#document-selector-datepicker-label").show()
        @loadPictures()
      else if type is "Note"
        $("#document-selector-datepicker").hide()
        $("#document-selector-datepicker-label").hide()
        @loadNotes()

  # Displays dialog. Set a callback that will take document id as parameter.
  # When dialog is displayed, linked documents are displayed inside it.
  display: (callback) ->

    @setSelectDocListener callback
    # Set document type to note
    $("#document-selector-type").val("Note")
    @loadNotes()
    @element.fadeIn(400)

    
  # Set listener that will call callback when document is selected.
  # Weird trick to ensure right callback is called when selector is displayed.
  setSelectDocListener: (callback) ->
    if @fun != undefined
      $("#document-selector-select").unbind "click", @fun
    @fun = (event) =>
      if $("#document-selector-list .selected")
        callback
            id: $("#document-selector-list .selected")[0].id
            type: $("#document-selector-type :selected").text()
      @element.fadeOut(400)
    $("#document-selector-select").click @fun

  # When date is picked, last pictures until this date are loaded as a new 
  # list.
  onDatePicked: (dateText, event) =>
    d = Date.parse(dateText)
    sinceDate = d.toString("yyyy-MM-dd")

    $.get "/pictures/all/#{sinceDate}-00-00-00/html/", (data) =>
      @docList.html data
      @setupList "picture-row"
      callback() if callback?

  # Load notes inside document list.
  loadNotes: ->
    $.get "/notes/all/html/", (data) =>
      @docList.html data
      @setupList "note-row"
      
      @element.fadeIn(400)

  # Load five last published inside document list.
  loadPictures: ->
    $.get "/pictures/all/html/", (data) =>
      @docList.html data
      @setupList "picture-row"

  # Configure list so each element is selectable.
  setupList: (className) ->
    $(".#{className}").mouseenter (event) ->
      $(this).addClass("mouseover mouseover-dialog")
    $(".#{className}").mouseleave (event) ->
      $(this).removeClass("mouseover mouseover-dialog")

    selected = null
    $(".#{className}").click (event) ->
      if selected
        selected.removeClass "selected selected-dialog"

      $(this).addClass "selected selected-dialog"
      selected = $(this)


