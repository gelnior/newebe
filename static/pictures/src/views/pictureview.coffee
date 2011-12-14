## NewsView


# Main view for pictures application
class PicturesView extends Backbone.View
  el: $("#pictures")


  ### Events ###

  events:
    "click #pictures-my-button": "onMyClicked"
    "click #pictures-all-button": "onAllClicked"

  constructor: ->
    super()

  # Initiliaze binds functions to this view, sets up micropost colleciton
  # behaviours.
  initialize: ->
    @pictures = new PictureCollection
    
    @pictures.bind 'add', @prependOne
    @pictures.bind 'reset', @addAll
    @currentPath = "/pictures/last/"

    @selectedRow = null


  ### Listeners  ###

  # When my button is clicked, it only displays owner pictures.
  # Then my button is disabled and all button is enabled.
  onMyClicked: () =>
    @myButton.button "disable"
    @allButton.button "enable"
    @currentPath = "/pictures/last/my/"
    
    @datepicker.val null
    @reloadPictures null

  # When all button is clicked, it displays all pictures.
  # Then all button is disabled and my button is enabled.
  onAllClicked: () =>
    @myButton.button "enable"
    @allButton.button "disable"
    @currentPath = "/pictures/last/"

    @datepicker.val null
    @reloadPictures null

  # Select clicked row and deselect previously clicked row.
  onRowClicked: (row) =>
    if row != @selectedRow
      if @selectedRow
        @selectedRow.deselect()
      row.select()
      @selectedRow = row

  # When date is picked, only pictures posted before this date are loaded. 
  onDatePicked: (dateText, event) =>
    datePicked = Date.parse(dateText)
    date = datePicked.toString "yyyy-MM-dd"
    @reloadPictures date


  ### Functions  ###

  
  # Clear picture list then display more pictures button.
  clearNews: ->
    @pictureList.empty()
    $("#pictures-more").show()
  
  # Add pictures to current list. If less thant 30 picures are returned, 
  # it means that there are no more pictures, so more button is hidden.
  addAll: =>
    if @pictures.length > 0
      if @pictures.length < 10
        @moreButton.hide()
    else
      @moreButton.hide()
    @pictures.each @prependOne

    loadingIndicator.hide()
    @pictures.length

  # Appends *micropost* to the beginning of current post list (render it).
  appendOne: (picture) =>
    row = new PictureRow picture, @
    el = row.render()
    @pictureList.append(el)
    row

  # Prepends *micropost* to the end of current post list (render it).
  # Displays second tutorial of tutorial mode is on.
  prependOne: (picture) =>
    row = new PictureRow picture, @
    el = row.render()
    @pictureList.prepend(el)
    loadingIndicator.hide()
    row

  # Clears picture lists and reload pictures from *path* until *date*.
  reloadPictures: (date) =>
    @pictureList.empty()
    @selectedRow = null
    loadingIndicator.display()

    if date
      @pictures.url = @currentPath + date + '-23-59-00/'
    else
      @pictures.url = @currentPath

    @fetchData()
  
  # Reloads micro post list.
  fetchData: () =>
    @pictures.fetch
      error: ->
        infoDialog.display "Error occured while retrieving data."
        loadingIndicator.hide()
    @pictures



  ### UI Builders  ###

  
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    @datepicker.datepicker
      onSelect : @onDatePicked

  
  # Build JQuery widgets.
  setWidgets: ->
    @myButton = $("#pictures-my-button")
    @allButton = $("#pictures-all-button")
    @moreButton = $("#pictures-more")
    @datepicker = $("#pictures-from-datepicker")

    $("input#pictures-post-button").button()
    @myButton.button()
    @allButton.button()
    @allButton.button "disable"
    @moreButton.button()
    @datepicker.val(null)
    $("#pictures-a").addClass "disabled"

    @pictureList = $("#pictures-list")

    uploader = new qq.FileUploader
      element: document.getElementById('pictures-file-uploader'),
      action: '/pictures/fileuploader/',
      debug: true,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      onSubmit: (id, fileName) =>
        loadingIndicator.display()
      #  @setParams( title: $("#pictures-title-field").val())
      #, onComplete: (id, fileName, responseJSON) =>
      #  alert responseJSON
      , onComplete: (id, fileName, responseJSON) =>
        loadingIndicator.hide()
        picture = new Picture responseJSON
        row = new PictureRow picture, @
        rowEl = row.render()
        $(rowEl).hide()
        $(row.render()).prependTo(@pictureList).slideDown()
        @onRowClicked(row)
    

