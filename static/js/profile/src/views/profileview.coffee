### Main view for contact application    
###

class ProfileView extends Backbone.View
  el: $("#profile")

  constructor: ->
    super

  ##
  # Initiliaze bind functions to this view, sets up contact collection
  # behaviour.
  initialize: ->
    _.bindAll(this, 'onKeyUp', 'postUserInfo', 'fetch', 'addAll')

    @users = new UserCollection
    
    @users.bind('refresh', @addAll)
        

  ### Events
  ###

  ##
  # When key control is up it set is ctrl pressed variable to false.
  onKeyUp: (event) ->
    @postUserInfo()


  ### Functions
  ###

  ##
  # Adds all retrieved contacts to current contact list.
  addAll: ->
    @users
    @user = @users.first()
    
    $("#platform-profile-name").val(@user.getName())
    $("#platform-profile-city").val(@user.getCity())
    $("#platform-profile-url").val(@user.get("url"))

    if not @user.get("url")
      @tutorialOn = true
      @displayTutorial(1)

    @users


  # Reload user data.
  fetch: ->
    @users.fetch()
    @users


  ##
  # Send a post request to server and add post at the beginning of current 
  # post list.

  postUserInfo: ->
    @user.save(
        (
          name : $("#platform-profile-name").val()
          url : $("#platform-profile-url").val()
          city : $("#platform-profile-city").val()
        ),
        success: @testTutorial
    )
        
  testTutorial: ->
    if @tutorialOn
      @displayTutorial(2)
      @tutorialOn = false
    false

  # Displays tutorial in the tutorial DIV element.
  displayTutorial: (index) ->
    $.get("/profile/tutorial/" + index + "/", (data) ->
      $("#tutorial").html(data)
    )

  ### UI Builders
  ###

  ##
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    $("#platform-profile-name").keyup((event) -> profileApp.onKeyUp(event))
    $("#platform-profile-url").keyup((event) -> profileApp.onKeyUp(event))
    $("#platform-profile-city").keyup((event) -> profileApp.onKeyUp(event))

  ##
  # Build JQuery widgets.
  setWidgets: ->
    $("#profile input").val(null)
    $("#profile-a").addClass("disabled")

