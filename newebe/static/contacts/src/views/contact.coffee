## Contact Row

# ContactRow is the widget representation of a Contact instance.

class ContactRow extends Backbone.View

  tagName: "div"
  className: "platform-contact-row"

  # HTML Template

  template:  _.template('''
    <span class="platform-contact-row-buttons">
    <% if (state === "Wait for approval") { %>
      <a class="platform-contact-wap">Confirm</a>
    <% } %>
    <a class="platform-contact-retry">Retry</a>
    <a class="platform-contact-delete">X</a>    
    </span>
    <p class="platform-contact-url">
     <a class="contact-name" href=""><%= name %></a> | 
     <%= url %>
     <span class="platform-contact-state"> (<%= state %>)</span>
    </p>
  ''')

 # Events binding

  events:
    "click .platform-contact-delete": "onDeleteClicked"
    "click .platform-contact-wap": "onConfirmClicked"
    "click .platform-contact-retry": "onRetryClicked"
    "click .contact-name": "onNameClicked"
    "click" : "onClick"
    "mouseover": "onMouseOver"
    "mouseout": "onMouseOut"

  constructor: (@model, @mainView) ->
    super()
         
    @model.view = @


  ## Event listeners

  # When mouse is over a contact row buttons are displayed.
  onMouseOver: ->
    if not @selected
      $(@el).addClass("mouseover")

  # When mouse goes out a contact row buttons are hidden.
  onMouseOut: ->
    $(@el).removeClass("mouseover")

  # When row is clicked, it is selected : background changes and
  # buttons are displayed. Previously selected row is deselected.
  # This is handled by the main view.
  onClick: ->
    @mainView.onRowClicked(@)

  # When delete button is clicked, it displays a confirmation dialog box.
  # When deletion is confirmed, delete request is sent to server and contact
  # is remove from current page.
  onDeleteClicked: ->
    model = @model
    confirmationDialog.display(
      "Are you sure you want to delete this contact ?",
      =>
        confirmationDialog.hide()
        model.delete()
        @mainView.selectedRow = null
        $("#contact-preview").html(null)
    )

  # When retry button is clicked, adding contact request is sent to server.
  # On success, contact state is set to pending.
  onRetryClicked: ->
    $.ajax(
      type: "POST"
      url: "/contacts/" + @model.id + "retry/"
      data: '{"slug":"' + @model.slug + '"}'
      dataType : "json"
      success: (data) =>
        @model.state = "PENDING"
        @$(".platform-contact-state").html("(Pending)")
      error: (data) ->
        infoDialog.display "Contact request failed."
    )

  # When a contact is confirmed, it sends a PT request to the confirmation
  # service.
  onConfirmClicked: ->
    @model.saveToDb()

  # When author name is clicked, its data are displayed in the preview zone.
  onNameClicked: (event) ->
    $.get("/contacts/#{@model.get("key")}/html/", (data) =>
      $("#contact-preview").html(data)
      $("#contact-preview input").keypress @onTagFieldKeyPress
      $("#contact-preview input").keyup @onTagFieldKeyUp
      @isTagFieldHidden = true
      @isRemoveTagButtonsHidden = true
      $("#contact-preview input").hide()
      $("#profile-tag-list button").hide()
      $("#profile-add-tag-button").click @onAddTagButtonClicked
      $("#profile-remove-tag-button").click @onRemoveTagButtonClicked
      $("#profile-tag-list button").click @onDeleteTagButtonClicked
    )
    if event
      event.preventDefault()
    false

  # Display or hide add tag field when add tag button is clicked
  onAddTagButtonClicked: (event) ->
    $("#contact-preview input").toggle @isTagFieldHidden

  # Display or hides remove tag buttons displayed aside each tag when
  # remove tag button is clicked.
  onRemoveTagButtonClicked: (event) ->
    $("#profile-tag-list button").toggle @isRemoveTagButtonsHidden

  onDeleteTagButtonClicked: (event) =>
    tag = $($(event.target).parent().children()[0]).text().trim()
    @model.removeTag tag,
      success: ->
        $(event.target).parent().remove()
      error: ->
        infoDialog.display "Removing tag to contact failed."

  # Prevent other key than alpha numeric one to being typed.
  onTagFieldKeyPress: (event) =>
    key = event.which
    keychar = String.fromCharCode(key).toLowerCase()
    if ((key==null) || (key==0) || (key==8) ||
        (key==9) || (key==13) || (key==27) )
         return true

    if ((("abcdefghijklmnopqrstuvwxyz0123456789").indexOf(keychar) == -1))
       event.preventDefault()
       return false
  
  onTagFieldKeyUp: (event) =>
    value = $("#contact-preview input").val()
    $("#contact-preview input").val value.replace(/[^a-z0-9]/g, '')
    if event.which == 13
      if @model.isTagged value
        infoDialog.display "Tag already set"
      else
        @model.tags.push(value)
        @model.updateTags
          success: ->
            $("#contact-preview input").val null
            $("#profile-tag-list").append " " + value
          error: ->
            infoDialog.display "Adding tag to contact failed."


  ## Functions

  # Removes contact row element from DOM.
  remove: ->
    $(@el).remove()

  # Refresh displayed data with model data.
  refresh: (state) ->
    @.$(".platform-contact-state").text("(" + state + ")")

  # Builds contact row element from template and linked micro post data.
  # It sets the buttons jquery-ui behavior on utility links then it hides 
  # them. It does not set element to DOM.
  # It hides retry button when it is not needed.
  render: ->
    $(@el).html(@template(@model.toJSON()))
    @$(".platform-contact-delete").button()
    @$(".platform-contact-retry").button()
    @$(".platform-contact-wap").button()
    @$(".platform-contact-row-buttons").hide()
    state = @model.getState()
    if state != "Error" and state != "pending"
      @$(".platform-contact-retry").hide()
    @el


  # Show delete button and set "selected" style.
  select: ->
    @$(".platform-contact-row-buttons").show()
    $(@el).removeClass("mouseover")
    $(@el).addClass("selected")
    @onNameClicked(null)
    
  # Hide delete button and remove "selected" style.
  deselect: ->
    @$(".platform-contact-row-buttons").hide()
    $(@el).removeClass("selected")
    $("#contact-preview").html(null)
