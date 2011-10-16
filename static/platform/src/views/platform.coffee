## Platform view

# Main view for applications navigation 

class PlatformView extends Backbone.View
  el: $("body")

  events:
    "click #news-a": "onNewsClicked"
    "click #profile-a": "onProfileClicked"
    "click #contact-a": "onContactClicked"
    "click #activities-a": "onActivitiesClicked"
    "click #notes-a": "onNotesClicked"


  constructor: (controller) ->
    @controller = controller
    controller.registerView(@)

    @isChangingPage = false
    super

  # Initiliaze binds functions to this view.
  # Registers current page as last page selected. It is needed to update menu
  # items (disabled or not) when user changes application.
  initialize: ->
    _.bindAll(this, 'onNewsClicked', 'onProfileClicked', 'switchTo', 'onContactClicked', 'onActivitiesClicked', 'onLogoutClicked')

    if $("#news").length != 0
      @lastPage = "#news"
    else if $("#contact").length != 0
      @lastPage = "#contact"
    else if $("#activities").length != 0
      @lastPage = "#activities"
    else if $("#notes").length != 0
      @lastPage = "#notes"
    else
      @lastPage = "#profile"

    $("#platform-user-text-field").val(null)
    $("#platform-user-text-field").focus()

  # When news is clicked, current page is hidden and news page is displayed.
  onNewsClicked: (ev) ->
    if ev
      ev.preventDefault()

    @switchTo("#news", '/news/content/', "News")
    false

  # When profile is clicked, current page is hidden and profile
  # page is displayed.
  onProfileClicked: (ev) ->
    if ev
      ev.preventDefault()

    @switchTo("#profile", '/profile/content/', "Profile")
    false

  # When contact is clicked, current page is hidden and contact
  # page is displayed.
  onContactClicked: (ev) ->
    if ev
      ev.preventDefault()

    @switchTo("#contact", '/contact/content/', "Contact")
    false

  # When activities is clicked, current page is hidden and activities
  # page is displayed.
  onActivitiesClicked: (ev) ->
    if ev
      ev.preventDefault()

    @switchTo("#activities", '/activities/content/', "Activities")
    false

  # When notes is clicked, current page is hidden and notes
  # page is displayed.
  onNotesClicked: (ev) ->
    if ev
      ev.preventDefault()

    @switchTo("#notes", '/notes/content/', "Notes")
    false

  # Switch to *page*: hides current page and displays *page*. 
  # If has not been loaded it appends html 
  # data retrieved at corresponding *url*. Switching begins by current page 
  # fade out.
  switchTo: (page, url, title) ->

    if not @isChangingPage
      @isChangingPage = true
      document.title = "Newebe | " + title

      $(@lastPage + "-a").removeClass("disabled")
      $(page + "-a").addClass("disabled")
      @controller.navigate(page)

      if @lastPage != page
        $(@lastPage).fadeOut(@onLastPageFadeOut(page, url))
      else
        @isChangingPage = false

      @lastPage



  # When last page fade out finishes, it fades in *page* or load it from *url* 
  # if page is not yet loaded.
  onLastPageFadeOut:(page, url) ->
    $(@lastPage).hide()
    @lastPage = page
    if($(page).length == 0)
      $.get(url,
        (data) =>
          $("#apps").prepend(data)
          $(page).fadeIn()
          @isChangingPage = false
      )
    else
      $(page).fadeIn()
      @isChangingPage = false
    false

