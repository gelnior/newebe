## Profile View

# Main view for profile application.

class ProfileView extends Backbone.View
  el: $("#profile")

  constructor: ->
    super()
  
  # Initiliaze bind functions to this view, sets up user collection
  # behaviour.
  initialize: ->
    _.bindAll(this, 'onKeyUp', 'postUserInfo', 'fetch', 'addAll')

    @users = new UserCollection
    @isEditing = false
    
    @users.bind('reset', @addAll)
        

  ### Events ###

  events:
    "click #profile-description-edit" : "onDescriptionEditClicked"
    "click #profile-change-password" : "onChangePasswordClicked"
    "mouseover #profile div.app" : "onMouseOver"
    "mouseout #profile div.app" : "onMouseOut"

  # When key control is up it set is ctrl pressed variable to false.
  onKeyUp: (event) ->
    @postUserInfo()
    event

  onMouseOver: (event) =>
    $("#profile-description-edit").show()
    $("#profile-change-password").show()

  onMouseOut: (event) =>
    $("#profile-description-edit").hide()
    $("#profile-change-password").hide()

  onDescriptionEditClicked: (event) =>

    if not @isEditing
      @isEditing = true
      $("#profile-description-display").fadeOut ->
        $("#profile-description-display").hide()
        $("#profile-description").slideDown ->
          $("#profile-preview").fadeIn()
      
    else
      @isEditing = false
      $("#profile-preview").fadeOut ->
        $("#profile-description").slideUp ->
          $("#profile-description-display").fadeIn()

    false

  onChangePasswordClicked: (event) ->
    formDialog.clearFields()
    formDialog.addField name: "new-password"

    formDialog.display "Type your new sesame", () ->
      if formDialog.getVal(0) and formDialog.getVal(0).length > 3
        loadingIndicator.display()
        $.ajax
          type: "PUT"
          url: "/user/password/"
          data: "{\"password\":\"#{formDialog.getVal(0)}\"}"
          dataType: "json"
          success: =>
            formDialog.hide()
            loadingIndicator.hide()
          error: =>
            formDialog.hide()
            loadingIndicator.hide()
            infoDialog.display "Error occured while changing password."
        
      else
        infoDialog.display "Please enter a sesame with at least 4 characters"
        


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

    $("#profile-description-display").html(desc)
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
    $("#profile-description").hide()
    $("#profile-preview").hide()
    $("#profile-description-edit").button()
    $("#profile-description-edit").hide()
    $("#profile-change-password").button()
    $("#profile-change-password").hide()


