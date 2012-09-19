## NewsView


# Main view for commons application
class CommonsView extends Backbone.View
  el: $("#commons")


  ### Events ###

  events:
    "click #commons-more-button": "onMoreClicked"

  constructor: ->
    super()

  # Initialize binds functions to this view, sets up commons collection
  # behaviours.
  initialize: ->
    @commons = new CommonCollection
    @moreCommons = new CommonCollection
    
    @commons.bind 'add', @prependOne
    @commons.bind 'reset', @addAll
    @moreCommons.bind 'reset', @addAllMore

    @currentPath = "/commons/all/"

    @selectedRow = null


  ### Listeners  ###

  # When more button is clicked, last commons until eldest common are
  # loaded.
  onMoreClicked: =>
    @moreCommons.url = @currentPath + @lastDate + "/"
    @moreCommons.url += "tags/" + @currentTag + "/"
    @moreCommons.fetch()

  # Select clicked row and deselect previously clicked row.
  onRowClicked: (row) =>
    if row != @selectedRow
      if @selectedRow
        @selectedRow.deselect()
      row.select()
      @selectedRow = row

  # When date is picked, only commons posted before this date are loaded. 
  onDatePicked: (dateText, event) =>
    datePicked = Date.parse(dateText)
    date = datePicked.toString "yyyy-MM-dd"

    if @currentPath == "/commons/mine/"
      Backbone.history.navigate "commons/mine/until/" + date + "/", true
    else
      Backbone.history.navigate "commons/all/until/" + date + "/", true

  # When a file is submitted, loading indicator is displayed. 
  onFileSubmitted:  (id, fileName) =>
   loadingIndicator.display()

  # When image upload is complete, a new row is built for the 
  onFileUploadComplete: (id, fileName, responseJSON) =>
    loadingIndicator.hide()
    common = new Common responseJSON
    row = new CommonRow common, @
    rowEl = row.render()
    $(rowEl).hide()
    $(row.render()).prependTo(@commonList).slideDown()
    @onRowClicked(row)

  # When tag is changed, preview section and currently displayed common list
  # are cleared. Then commons are loaded for selected tag.
  onTagChanged: =>
    $("#common-list").html null
    $("#commons-preview").html null

    @currentTag = @tagCombo.getSelection()
    @uploader.setParams
      tag: @currentTag
    @datepicker.val null
    @reloadCommons null


  ### Functions  ###

  
  # Add commons to current list. If less than 10 commons are returned, 
  # it means that there are no more commons, so more button is hidden.
  addAll: =>
    if @commons.length >= 0 and @commons.length < 10
      @moreButton.hide()
    else
      common = @commons.first()
      @lastDate = common.getUrlDate()
      @moreButton.show()

    @commons.each @prependOne

    loadingIndicator.hide()
    @commons.length

  addAllMore: =>
    commons = @moreCommons.toArray().reverse()
    commons = _.rest(commons)

    if @moreCommons.length >= 0 and @moreCommons.length < 10
      @moreButton.hide()
    else
      common = @moreCommons.last()
      @lastDate = common.getUrlDate()
      @moreButton.show()

    _.each(commons, @appendOne)

    loadingIndicator.hide()
    @moreCommons.length


  # Appends *common* to the beginning of current post list (render it).
  appendOne: (common) =>
    row = new CommonRow common, @
    el = row.render()
    @commonList.append(el)
    row

  # Prepends *common* to the end of current post list (render it).
  prependOne: (common) =>
    row = new CommonRow common, @
    el = row.render()
    @commonList.prepend(el)
    row

  # Clears common lists and reload commons from *path* until *date*.
  reloadCommons: (date) =>
    @commonList.empty()
    @selectedRow = null
    loadingIndicator.display()

    if not date?
      date = (new Date()).toString "yyyy-MM-dd"
    @commons.url = @currentPath
    @commons.url += date + '-23-59-00/'
    @commons.url += "tags/" + @currentTag + "/"
    @commons.fetch
      error: =>
        alert "An error occured while retrieving commons"
        loadingIndicator.hide()
        @moreButton.hide()

    @commons

  
  # Reloads common list.
  fetchData: () =>
    @selectedRow = null
    @tagCombo.fetch (tag) =>
      @currentTag = tag
      @uploader.setParams
          tag: @currentTag
      @reloadCommons date
    @commons

  # When my button is clicked, it only displays owner commons.
  # Then my button is disabled and all button is enabled.
  displayMyCommons:(date) =>
    @myButton.button "disable"
    @allButton.button "enable"
    @currentPath = "/commons/mine/"
    
    @datepicker.val date
    @reloadCommons date

  # When all button is clicked, it displays all commons.
  # Then all button is disabled and my button is enabled.
  displayAllCommons: (date) =>
    @myButton.button "enable"
    @allButton.button "disable"
    @currentPath = "/commons/all/"

    @datepicker.val date
    @tagCombo.fetch (tag) =>
      @currentTag = tag
      @reloadCommons date


  ### UI Builders  ###

  
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    @datepicker.datepicker
      onSelect : @onDatePicked
    @tagCombo.element.change @onTagChanged

  # Build JQuery widgets.
  setWidgets: ->
    @myButton = $("#commons-my-button")
    @allButton = $("#commons-all-button")
    @moreButton = $("#commons-more-button")
    @datepicker = $("#commons-from-datepicker")

    @myButton.button()
    @allButton.button()
    @allButton.button "disable"
    @moreButton.button()
    @datepicker.val(null)

    @commonList = $("#commons-list")
    @tagCombo = new TagCombo $("#commons-tag-combo")

    @uploader = new qq.FileUploader
      element: document.getElementById('commons-file-uploader'),
      action: '/commons/fileuploader/',
      debug: true,
      onSubmit: @onFileSubmitted,
      onComplete: @onFileUploadComplete

