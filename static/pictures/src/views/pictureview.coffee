## NewsView


# Main view for pictures application
class PicturesView extends Backbone.View
  el: $("#pictures")


  ### Events ###

  events:
    "click #pictures-more-button": "onMoreClicked"

  constructor: ->
    super()

  # Initialize binds functions to this view, sets up pictures collection
  # behaviours.
  initialize: ->
    @pictures = new PictureCollection
    @morePictures = new PictureCollection
    
    @pictures.bind 'add', @prependOne
    @pictures.bind 'reset', @addAll
    @morePictures.bind 'reset', @addAllMore

    @currentPath = "/pictures/all/"

    @selectedRow = null


  ### Listeners  ###

  # When more button is clicked, last pictures until eldest picture are
  # loaded.
  onMoreClicked: =>
    @morePictures.url = @currentPath + @lastDate + "/"
    @morePictures.url += "tags/" + @currentTag + "/"
    @morePictures.fetch()

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

    if @currentPath == "/pictures/mine/"
      Backbone.history.navigate "pictures/mine/until/" + date + "/", true
    else
      Backbone.history.navigate "pictures/all/until/" + date + "/", true

  # When a file is submitted, loading indicator is displayed. 
  onFileSubmitted:  (id, fileName) =>
   loadingIndicator.display()

  # When image upload is complete, a new row is built for the 
  onFileUploadComplete: (id, fileName, responseJSON) =>
    loadingIndicator.hide()
    picture = new Picture responseJSON
    row = new PictureRow picture, @
    rowEl = row.render()
    $(rowEl).hide()
    $(row.render()).prependTo(@pictureList).slideDown()
    @onRowClicked(row)

  # When tag is changed, preview section and currently displayed picture list
  # are cleared. Then pictures are loaded for selected tag.
  onTagChanged: =>
    $("#picture-list").html null
    $("#pictures-preview").html null

    @currentTag = @tagCombo.getSelection()
    @uploader.setParams
      tag: @currentTag
    @datepicker.val null
    @reloadPictures null

  # Loads and displays last owner pictures.
  # Then my button is disabled and all button is enabled.
  displayMyPictures:(date) =>
    @myButton.button "disable"
    @allButton.button "enable"
    @currentPath = "/pictures/mine/"

    @datepicker.val date
    @reloadPictures date

  # Loads and dispay last pictures.
  # Then all button is disabled and my button is enabled.
  displayAllPictures: (date) =>
    @myButton.button "enable"
    @allButton.button "disable"
    @currentPath = "/pictures/all/"

    @datepicker.val date
    @reloadPictures date


  ### Functions  ###

  
  # Add pictures to current list. If less than 10 pictures are returned, 
  # it means that there are no more pictures, so more button is hidden.
  addAll: =>
    if @pictures.length >= 0 and @pictures.length < 10
      @moreButton.hide()
    else
      picture = @pictures.first()
      @lastDate = picture.getUrlDate()
      @moreButton.show()

    @pictures.each @prependOne

    loadingIndicator.hide()
    @pictures.length

  addAllMore: =>
    pictures = @morePictures.toArray().reverse()
    pictures = _.rest(pictures)

    if @morePictures.length >= 0 and @morePictures.length < 10
      @moreButton.hide()
    else
      picture = @morePictures.last()
      @lastDate = picture.getUrlDate()
      @moreButton.show()

    _.each(pictures, @appendOne)

    loadingIndicator.hide()
    @morePictures.length


  # Appends *picture* to the beginning of current post list (render it).
  appendOne: (picture) =>
    row = new PictureRow picture, @
    el = row.render()
    @pictureList.append(el)
    row

  # Prepends *picture* to the end of current post list (render it).
  prependOne: (picture) =>
    row = new PictureRow picture, @
    el = row.render()
    @pictureList.prepend(el)
    row

  # Clears picture lists and reload pictures from *path* until *date*.
  reloadPictures: (date) =>
    @pictureList.empty()
    @selectedRow = null
    loadingIndicator.display()

    if not date?
      date = (new Date()).toString "yyyy-MM-dd"
    @pictures.url = @currentPath
    @pictures.url += date + '-23-59-00/'
    @pictures.url += "tags/" + @currentTag + "/"
    @pictures.fetch
      error: =>
        alert "An error occured while retrieving pictures"
        loadingIndicator.hide()
        @moreButton.hide()

    @pictures

  
  # Reloads picture list.
  fetchData: () =>
    @selectedRow = null
    @tagCombo.fetch (tag) =>
      @currentTag = tag
      @uploader.setParams
          tag: @currentTag
      @reloadPictures date
    @pictures

  # When my button is clicked, it only displays owner pictures.
  # Then my button is disabled and all button is enabled.
  displayMyPictures:(date) =>
    @myButton.button "disable"
    @allButton.button "enable"
    @currentPath = "/pictures/mine/"
    
    @datepicker.val date
    @reloadPictures date

  # When all button is clicked, it displays all pictures.
  # Then all button is disabled and my button is enabled.
  displayAllPictures: (date) =>
    @myButton.button "enable"
    @allButton.button "disable"
    @currentPath = "/pictures/all/"

    @datepicker.val date
    @tagCombo.fetch (tag) =>
      @currentTag = tag
      @reloadPictures date


  ### UI Builders  ###

  
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    @datepicker.datepicker
      onSelect : @onDatePicked
    @tagCombo.element.change @onTagChanged

  # Build JQuery widgets.
  setWidgets: ->
    @myButton = $("#pictures-my-button")
    @allButton = $("#pictures-all-button")
    @moreButton = $("#pictures-more-button")
    @datepicker = $("#pictures-from-datepicker")

    @myButton.button()
    @allButton.button()
    @allButton.button "disable"
    @moreButton.button()
    @datepicker.val(null)

    @pictureList = $("#pictures-list")
    @tagCombo = new TagCombo $("#pictures-tag-combo")

    @uploader = new qq.FileUploader
      element: document.getElementById('pictures-file-uploader'),
      action: '/pictures/fileuploader/',
      debug: true,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      onSubmit: @onFileSubmitted,
          #  @setParams( title: $("#pictures-title-field").val())
      #, onComplete: (id, fileName, responseJSON) =>
      #  alert responseJSON
      onComplete: @onFileUploadComplete

