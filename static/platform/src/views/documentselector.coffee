
## DocumentSelector

# Dialog used to select a document
class DocumentSelector
   
  # Constructor : builds HTML element, then hides it.
  # Set listener on cancel button.
  constructor: ->
    if $("#document-selector") == undefined \
        or $("#document-selector").length == 0

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
        <div id="document-selector-list">
        </div>
      ''')
      @docList = $("#document-selector-list")
  
      $("#document-selector-cancel").click =>
        @element.fadeOut(400)

    else
      @element = $("#document-selector")
      @docList = $("#document-selector-list")

    @element.hide()


  # Displays dialog. Set a callback that will take document id as parameter.
  # When dialog is displayed, linked documents are displayed inside it.
  display: (callback) ->

    # Set listener that will call callback when document is selected.
    if @fun != undefined
      $("#document-selector-select").unbind "click", @fun
    @fun = (event) =>
      if $("#document-selector-list .selected")
        callback($("#document-selector-list .selected")[0].id)
      @element.fadeOut(400)
    $("#document-selector-select").click @fun

    # Refresh document list
    @docList.empty()
    $.get "/notes/all/html/", (data) =>
      @docList.html data

      $(".note-row").mouseenter (event) ->
        $(this).addClass("mouseover mouseover-dialog")
      $(".note-row").mouseleave (event) ->
        $(this).removeClass("mouseover mouseover-dialog")

      selected = null
      $(".note-row").click (event) ->
        if selected
          selected.removeClass "selected selected-dialog"

        $(this).addClass "selected selected-dialog"
        selected = $(this)

      @element.fadeIn(400)

