## Register view

# This view is displayed when no user is set for the newebe current instance.
# It displays form to user for registering. Newebe is mono user so 
# only one person can register. When the first person registers, it will become
# the newebe owner.
class RegisterView extends Backbone.View
  el: $("body")

  constructor: ->
    super

  # Clears and focus name field. Registers events.
  initialize: ->
    _.bindAll(this, 'onUserFieldKeyUp')

    @isPosting = false
    $("#platform-user-text-field").val(null)
    $("#platform-user-text-field").focus()
    $("#platform-user-text-field").keyup(@onUserFieldKeyUp)


  # When user field key is up, if it is enter key, it posts typed name to 
  # backend services (commit registration) and displays page to set up 
  # password.
  onUserFieldKeyUp: (event) ->
    if event.keyCode == 13 and not @isPosting
      dataPost = '{ "name":"' + $("#platform-user-text-field").val() + '"}'
      @isPosting = true
      url = "/register/"
      $.post(url, dataPost,
        (data) ->
          $("#register").fadeOut(1600,
            () ->
              $("body").hide()
              $.get("/register/password/content/",
                (data) ->
                  $("body").prepend(data)
                  $("#menu").hide()
                  $("#apps").hide()
                  $("body").show()
                  $("#menu").fadeIn()
                  $("#apps").fadeIn()
                  registerPasswordView = new RegisterPasswordView
              )
          )
        , "json"
      )
      

## RegisterPasswordView

# This view is here to let user sets up his password. When he sets its password
# this view is hidden then the profile application is displayed.
class RegisterPasswordView extends Backbone.View
  el: $("body")

  constructor: ->
    super

  # Clears and focus password field. Registers events.
  initialize: ->
    _.bindAll(this, 'onUserFieldKeyUp')

    @isPosting = false
    $("#platform-password-text-field").val(null)
    $("#platform-password-text-field").focus()
    $("#platform-password-text-field").keyup(@onUserFieldKeyUp)


  # When user field key is up, if it is enter key, it posts typed password to 
  # backend services (commit registration) and displays profile application.
  onUserFieldKeyUp: (event) ->
    if (event.keyCode == 13 or e.which == 13) and not @isPosting
      dataPost = '{ "password":"' + $("#platform-password-text-field").val() + '"}'
      @isPosting = true
      url = "/register/password/"
      $.post(url, dataPost,
        (data) ->
          $("#register").fadeOut(1600,
            () ->
              $("body").hide()
              $.get("/profile/menu-content/",
                (data) ->
                  $("body").prepend(data)
                  $("#menu").hide()
                  $("#apps").hide()
                  $("body").show()
                  $("#menu").fadeIn()
                  $("#apps").fadeIn()
              )
          )
        , "json"
      )


# This view displays a simple field to let user type its password (its Sesame).
# Password is sent when enter key is typed.
# If password is wrong, the password field is cleared and uset need to retry.
# If password is right, the news application is displayed.
class LoginView extends Backbone.View
  el: $("body")

  constructor: ->
    super

  # Clears and focus pasword field. Registers events.
  initialize: ->
    _.bindAll(this, 'onPasswordFieldKeyUp')

    @isPosting = false
    $("#login-password-text-field").val(null)
    $("#login-password-text-field").focus()
    $("#login-password-text-field").keyup(@onPasswordFieldKeyUp)

  # If enter key is typed, the following sequence occurs :
  # If password is wrong, the password field is cleared and uset need to retry.
  # If password is right, the news application is displayed.
  onPasswordFieldKeyUp: (event) ->
    if event.keyCode == 13 and not @isPosting
      @isPosting = true
      url = "/login/json/"

      dataPost = '{ "password":"' + $("#login-password-text-field").val() + '"}'

      $.ajax(
        type: "POST"
        url: url
        data: dataPost
        datatype: "json"
        success: (data) =>
          $("#login-form").fadeOut(1600,
            () =>
              $("body").hide()
              $.get("/profile/menu-content/",
                (data) =>
                  $("body").prepend(data)
                  $("#menu").hide()
                  $("#apps").hide()
                  $("body").show()
                  $("#menu").fadeIn()
                  $("#apps").fadeIn()
                  
                  @isPosting = false
              )
          )
        error: () =>
          $("#login-password-text-field").val(null)
          @isPosting = false
      )

