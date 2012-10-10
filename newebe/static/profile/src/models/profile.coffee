## User

# Model for current User
class User extends Backbone.Model

  #  Url where contacts lives.
  url: '/user/'

  # Constructor initializes its field from a javascript raw object.
  # Fields:
  #
  # * url : current newebe instance URL.
  # * name : current newebe owner Name.
  constructor: (user) ->
    super

    @id =  ""
    @set("url", user.url)
    @set("name", user.name)
    @set("description", user.description)
    
  ### Setters / Accessors ###

  getName: ->
    @get("name")

  setName: (name) ->
    alert name
    @set("name", name)
    alert @getName()

  getUrl: ->
    @get("userUrl")

  setUrl: (url) ->
    @set("url", url)

  getDescription: ->
    @get("description")

  setDescription: (description) ->
    @set("description", description)


  # User is never new. If this page is displayed, it means that the owner
  # is already registered.
  isNew: ->
    false
    

### Model for a User collection ###

class UserCollection extends Backbone.Collection
  model: User

  # Url where user lives.
  url: '/user/'
  
  # Select which field from backend response to use for parsing to populate  
  # collection.
  parse: (response) ->
    response.rows


