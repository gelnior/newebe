
## FormDialog


# Dialog used to let user type data
class FormDialog

  constructor: () ->
    if $("#form-dialog").length == 0

      div = document.createElement('div')
      div.id = "form-dialog"
      div.className = "dialog"
      $("body").prepend(div)
      @element = $("#form-dialog")
      @element.html('''
        <div id="form-dialog-text"></div>
        <div id="form-dialog-buttons">'
          <span id="form-dialog-yes">Yes</span>
          <span id="form-dialog-no">No</span>
        </div>
      ''')

    @element = $("#form-dialog")
    @element.hide()

    @fields = []

  addField: (field) ->
    @fields.append(field)

  clearFields: () ->
    @fields = []

   # Hide when no button is clicked.
   setNoButton: ->
     divElement = @element
     $("#confirmation-no").click(
       () ->
         divElement.fadeOut()
         false
     )

   # Displays confirmation dialog with givent *text* and set callback function
   # on click event.
   display: (text, callback) ->
     $("#confirmation-text").empty()
     $("#confirmation-text").append('<span>' + text + '</span>')
     $("#confirmation-yes").click(callback)
     @element.show()
      

   # Hide confirmation dialog
   hide: ->
     @element.fadeOut()

