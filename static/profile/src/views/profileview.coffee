## Profile View

# Main view for profile application.

class ProfileView extends Backbone.View
  el: $("#profile")

  constructor: ->
    super
  
  # Initiliaze bind functions to this view, sets up user collection
  # behaviour.
  initialize: ->
    _.bindAll(this, 'onKeyUp', 'postUserInfo', 'fetch', 'addAll')

    @users = new UserCollection
    
    @users.bind('refresh', @addAll)
        

  ### Events ###

  # When key control is up it set is ctrl pressed variable to false.
  onKeyUp: (event) ->
    @postUserInfo()
    event


  ### Functions ###

  # Fills user form with data retrieved from current user service.
  addAll: ->
    @users
    @user = @users.first()
    
    $("#platform-profile-name").val(@user.getName())
    $("#profile-description").val(@user.getDescription())
    $("#platform-profile-url").val(@user.get("url"))

    @renderProfile()

    if not @user.get("url")
      @tutorialOn = true
      @displayTutorial(1)

    @users


  # Reloads user data.
  fetch: ->
    @users.fetch()
    @users


  # Sends a put request to server to update data. if it is in tutorial mode,
  # success tutorial is displayed.
  postUserInfo: ->
    $("#profile").addClass("modified")
    tutorialOn = @tutorialOn
    @user.save(
        (
          name : $("#platform-profile-name").val()
          url : $("#platform-profile-url").val()
          description : $("#profile-description").val()
        ),
        success: () ->
          if tutorialOn
            $.get("/profile/tutorial/2/", (data) ->
              $("#tutorial-profile").html(data)
            )
          $("#profile").removeClass("modified")
        )
       
    @renderProfile()

  # Displays the second tutorial if tutorial mode is on.
  testTutorial: ->
    if @tutorialOn
      @displayTutorial(2)
      @tutorialOn = false
    false

  # Displays tutorial in the tutorial DIV element.
  displayTutorial: (index) ->
    $.get("/profile/tutorial/" + index + "/", (data) ->
      $("#tutorial-profile").html(data)
    )

  renderProfile: ->
    renderer = _.template('''
    <h1 class="profile-name"><%= name %></h1>
    <p class="profile-url"><%= url %></p>
    <p class="profile-description"><%= description %></p>
    '''
    )

    desc = $("#profile-description").val()
    converter = new Showdown.converter()
    desc = converter.makeHtml(desc)

    $("#profile-render").html(renderer(
        name : $("#platform-profile-name").val()
        url : $("#platform-profile-url").val()
        description : desc
    ))
    @user


  ### UI Builders ###

  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    $("#platform-profile-name").keyup((event) -> profileApp.onKeyUp(event))
    $("#platform-profile-url").keyup((event) -> profileApp.onKeyUp(event))
    $("#profile-description").keyup((event) -> profileApp.onKeyUp(event))

  # Build JQuery widgets.
  setWidgets: ->
    $("#profile input").val(null)
    $("#profile-a").addClass("disabled")

