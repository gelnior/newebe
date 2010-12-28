### Main view for applications navigation
###

class PlatformView extends Backbone.View
  el: $("body")

  events:
    "click #news-a": "onNewsClicked"
    "click #profile-a": "onProfileClicked"
    "click #contact-a": "onContactClicked"


  constructor: ->
    super

  ##
  # Initiliaze bind functions to this view and sets up micropost collection
  # behaviours.
  # Register last page selector for application browsing.
  # If register view is displayed
  initialize: ->
    _.bindAll(this, 'onNewsClicked', 'onProfileClicked', 'switchTo', 'onContactClicked')
    if $("#news").length != 0
      @lastPage =  "#news"
    else if $("#contact").length != 0
      @lastPage = "#contact"
    else
      @lastPage = "#profile"

    $("#platform-user-text-field").val(null)
    $("#platform-user-text-field").focus()

  ##
  # When news is clicked, current page is hidden and news page is displayed.
  onNewsClicked: (ev) ->
    ev.preventDefault()
    document.title = "Newebe | News"
    @switchTo("#news", '/news/content/')
    false

  ##
  # When profile is clicked, current page is hidden and profile
  # page is displayed.
  onProfileClicked: (ev) ->
    ev.preventDefault()
    document.title = "Newebe | Profile"
    @switchTo("#profile", '/platform/profile/content/')
    false

  onContactClicked: (ev) ->
    ev.preventDefault()
    document.title = "Newebe | Contact"
    @switchTo("#contact", '/platform/contact/content/')
    false

  ##
  # Switch to *page*. If page does not exists it is append from html 
  # data retrived at *url*. Switching begins by current page fade out.
  switchTo: (page, url) ->
    $(@lastPage + "-a").removeClass("disabled")
    $(page + "-a").addClass("disabled")

    if @lastPage != page
      $(@lastPage).fadeOut(@onLastPageFadeOut(page, url))
    @lastPage

  ##
  # When last page fade out it fades in *page* or load it from *url* if page
  # is not present.
  onLastPageFadeOut:(page, url) ->
    $(@lastPage).hide()
    @lastPage = page
    if($(page).length == 0)
      $.get(url,
        (data) ->
          $("#apps").prepend(data)
          $(page).fadeIn()
      )
    else
      $(page).fadeIn()
    false

