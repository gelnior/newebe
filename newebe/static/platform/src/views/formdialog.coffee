
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
        <div id="form-dialog-fields">
        </div>
        <div id="form-dialog-buttons">
          <span id="form-dialog-yes">ok</span>
          <span id="form-dialog-no">cancel</span>
        </div>
      ''')

    @element = $("#form-dialog")
    @setNoButton
    @element.hide()

    @fields = []


  addField: (field) ->
    @fields.push(field)
    if field.label
      $("#form-dialog-fields").append(
          "<label for=\"#{field.name}\"></label>")
    $("#form-dialog-fields").append(
        "<input class=\"form-dialog-field\" 
                id=\"form-dialog-field-#{field.name}\"
                type=\"text\" 
                name=\"#{field.name}\" />")
  

  clearFields: ->
    @fields = []
    $("#form-dialog-fields").html(null)


  # Hide when no button is clicked.
  setNoButton: ->
    $("#form-dialog-no").click( =>
        @element.fadeOut()
      false
    )


  # Displays confirmation dialog with givent *text* and set callback function
  # on click event.
  display: (text, callback) ->
    $("#form-dialog-text").empty()
    $("#form-dialog-text").append '<span>' + text + '</span>'
    $("#form-dialog-yes").click callback
    $("#form-dialog-no").click =>
      @element.hide()
   
    @element.show()

    if @fields
      document.getElementById("form-dialog-field-#{@fields[0].name}").focus()
      for field in @fields
        $("#form-dialog-field-#{field.name}").keyup (event) ->
          if event.keyCode == 13
            callback()


       
  getVal: (fieldIndex) ->
    $("#form-dialog-field-#{@fields[fieldIndex].name}").val()

  # Hide confirmation dialog
  hide: ->
    @element.fadeOut()

