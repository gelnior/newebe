### Main view for contact application ###

class ContactView extends Backbone.View
  el: $("#news")


  # Events binding

  events:
    "click #contact-post-button" : "onPostClicked"
    "submit #contact-post-button" : "onPostClicked"
    "click #contact-alm-button" : "onAllClicked"
    "click #contact-pending-button" : "onPendingClicked"
    "click #contact-request-button" : "onRequestedClicked"

  constructor: ->
    super

  initialize: ->
    _.bindAll(this, 'postNewContact', 'appendOne', 'prependOne', 'addAll')
    _.bindAll(this, 'onPostClicked')

    @contacts = new ContactCollection
    
    @contacts.bind('add', @prependOne)
    @contacts.bind('refresh', @addAll)
        

  ## Event listeners ##

  # When post button is clicked the contact request is posted.
  onPostClicked: (event) ->
    event.preventDefault()
    @postNewContact()
    event

  # When all button is clicked, list is refreshed with the whole contact list.
  onAllClicked: (event) ->
    event.preventDefault()
    @onFilterClicked("#contact-all-button", "/contacts/")

  # When pending button is clicked, list is refreshed with the list of contacts
  # that are waiting for an answer.
  onPendingClicked: (event) ->
    event.preventDefault()
    @onFilterClicked("#contact-pending-button", "/contacts/pending/")

  # When requested button is clicked, list is refreshed with the list of 
  # contacts that needs a confirmation.
  onRequestedClicked: (event) ->
    event.preventDefault()
    @onFilterClicked("#contact-request-button", "/contacts/requested/")

  # When a filter button is clicked, it checks which button has been
  # clicked last time : enables this button then disable button thats has
  # been clicked before.
  onFilterClicked: (filterClicked, path) ->
    if(@lastFilterClicked != filterClicked)
      $(filterClicked).button( "option", "disabled", true )
      $(@lastFilterClicked).button( "option", "disabled", false )
      @lastFilterClicked = filterClicked
      @reloadContacts(path)


  ### Functions ###

  # Reloads contact list (whole list).
  reloadContacts: (url) ->
    loadingIndicator.hide()
    @clearContacts()
    @contacts.url = url
    @contacts.fetch()
    @contacts

  # Clears contact list then display more news button.
  clearContacts: ->
    $("#contacts").empty()


  # Adds all retrieved contacts to current contact list.
  addAll: ->
    @contacts.each(@appendOne)
    loadingIndicator.hide()
    @contacts

  # Append *contact* to the beginning of current contact list (render it).
  appendOne: (contact) ->
    row = new ContactRow contact
    el = row.render()
    $("#contacts").prepend(el)
    row

  # Prepend *contact* to the end of current contact list (render it).
  prependOne: (contact) ->
    row = new ContactRow contact
    el = row.render()
    $("#contacts").prepend(el)
    loadingIndicator.hide()

  # Clears contact list then display more news button.
  clearContacts: ->
    $("#contacts").empty()


  # Adds all retrieved contacts to current contact list.
  addAll: ->
    @contacts.each(@appendOne)
    loadingIndicator.hide()
    @contacts

  # Appends *contact* to the beginning of current post list (render it).
  appendOne: (contact) ->
    row = new ContactRow contact
    el = row.render()
    $("#contacts").prepend(el)
    row

  # Prepends *contact* to the end of current contact list (render it).
  prependOne: (contact) ->
    row = new ContactRow contact
    el = row.render()
    $("#contacts").prepend(el)
    loadingIndicator.hide()
    row

  # Clears post field and focus it.
  clearPostField: () ->
    $("#contact-url-field").val(null)
    $("#contact-url-field").focus()
    $("#contact-url-field")


  # Clear url field and focus it.
  clearPostField: () ->
    $("#contact-url-field").val(null)
    $("#contact-url-field").focus()
    $("#contact-url-field")

  # Reloads contact list.
  fetch: () ->
    @contacts.fetch()
    @contacts

  # Send a post request to server and add current at the beginning of current 
  # contact list.
  postNewContact: ()->
    contactUrl = $("#contact-url-field").val()
    if @contacts.find((contact) -> contactUrl == contact.getUrl())
      infoDialog.display("Contact is already in your list")
    else
      loadingIndicator.display()
      @contacts.create(url : contactUrl,
        success : (model, response) ->  loadingIndicator.hide(),
        error: (model, response) ->
         loadingIndicator.hide()
         infoDialog.display("An error occured on server. Please refresh the contact list.")
        )


      $("#contact-url-field").val(null)
      $("#contact-url-field").focus()
    
    false


  ### UI Builders ###

  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
      
      #:$("#contact-url-field").keydown((event) -> contactApp.onKeyDown(event))
    $("#contact-post-button").submit((event) -> contactApp.onPostClicked(event))
    $("#contact-post-button").click((event) -> contactApp.onPostClicked(event))
    $("#contact-all-button").click((event) -> contactApp.onAllClicked(event))
    $("#contact-pending-button").click((event) ->
        contactApp.onPendingClicked(event))
    $("#contact-request-button").click((event) ->
        contactApp.onRequestedClicked(event))

  # Build JQuery widgets.
  setWidgets: ->
    $("#contact-all-button").button()
    $("#contact-pending-button").button()
    $("#contact-request-button").button()
    $("input#contact-post-button").button()
    $("#contact-a").addClass("disabled")
    $("#contact-all-button").button( "option", "disabled", true)
    @lastFilterClicked = "#contact-all-button"

