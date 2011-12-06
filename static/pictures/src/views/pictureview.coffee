## NewsView


# Main view for pictures application
class PicturesView extends Backbone.View
  el: $("#pictures")


  ### Events ###

  events:
    "click #pictures-post-button" : "onPostClicked"
    "submit #pictures-post-button" : "onPostClicked"


  constructor: ->
    super()

  # Initiliaze binds functions to this view, sets up micropost colleciton
  # behaviours.
  initialize: ->
    @pictures = new PictureCollection
    
    @pictures.bind('add', @prependOne)
    @pictures.bind('reset', @addAll)
        
    @selectedRow = null


  ### Listeners  ###


  # When post button is clicked the content field is posted.
  onPostClicked: (event) ->
    event.preventDefault()
    @postNewPicture()
    event


  # Select clicked row and deselect previously clicked row.
  onRowClicked: (row) =>
    if row != @selectedRow
      if @selectedRow
        @selectedRow.deselect()
      row.select()
      @selectedRow = row

  
  ### Functions  ###

  
  # Clear picture list then display more pictures button.
  clearNews: ->
    $("#pictures-list").empty()
    $("#pictures-more").show()

  
  # Add pictures to current list. If less thant 30 picures are returned, 
  # it means that there are no more pictures, so more button is hidden.
  addAll: =>
    if @pictures.length > 0
      if @pictures.length < 30
        $("#pictures-more").hide()
    else
      $("#pictures-more").hide()
    @pictures.each(@prependOne)

    loadingIndicator.hide()
    @pictures.length

   
  # Appends *micropost* to the beginning of current post list (render it).
  appendOne: (picture) =>
    row = new PictureRow picture, @
    el = row.render()
    $("#pictures-list").append(el)
    row

   
  # Prepends *micropost* to the end of current post list (render it).
  # Displays second tutorial of tutorial mode is on.
  prependOne: (picture) =>
    row = new PictureRow picture, @
    el = row.render()
    $("#pictures-list").prepend(el)
    loadingIndicator.hide()
    row



  # Clears post field and focus it.
  clearPostField: () ->
    false
  
  # Clears micro posts lists and reload micro posts until *date*.
  reloadMicroPosts: (date, path) =>
    loadingIndicator.display()
    @selectedRow = null

    @pictures.fetch()
    @pictures

  
  # Reloads micro post list.
  fetchData: () ->
    @selectedRow = null
    @pictures.fetch()
    @pictures

  
  # Sends a post request to server and add post at the beginning of current 
  # post list. 
  # Urls are converted to markdown links to be displayed automatically as href
  # links.
  postNewPost: ()->
      false



  ### UI Builders  ###

  
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    $("input#pictures-from-datepicker").datepicker({
      onSelect : @onDatePicked
    })

  
  # Build JQuery widgets.
  setWidgets: ->
    $("input#pictures-post-button").button()
    $("#pictures-my-button").button()
    $("#pictures-all-button").button()
    $("#pictures-all-button").button("disable")
    $("#pictures-more").button()
    $("#pictures-from-datepicker").val(null)
    $("#pictures-a").addClass("disabled")

    uploader = new qq.FileUploader(
        element: document.getElementById('pictures-file-uploader'),
        action: '/pictures/fileuploader/',
        debug: true,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
        #onSubmit: (id, fileName) =>
        #  @setParams( title: $("#pictures-title-field").val())
        #, onComplete: (id, fileName, responseJSON) =>
        #  alert responseJSON
    )
