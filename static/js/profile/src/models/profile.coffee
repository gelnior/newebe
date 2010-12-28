### Model for current User
###

class User extends Backbone.Model

  ##  Url where contacts lives.
  url: '/platform/user/'

  ## Constructor initialize its field from a javascript raw object.
  ## Fields:
  ## url : contact URL.
  ## state : contact request state.
  constructor: (user) ->
    super

    @id =  ""
    @set("url", user.url)
    @set("name", user.name)
    @set("city", user.city)
    
  getName: ->
    @get("name")

  setName: (name) ->
    alert name
    @set("name", name)
    alert @getName()

  setUrl: (url) ->
    @set("url", url)

  setCity: (city) ->
    @set("city", city)


  getUrl: ->
    @get("userUrl")

  getCity: ->
    @get("city")

  # Contact is considered as new if no state is set.
  isNew: ->
    false
    

### Model for a User collection
###

class UserCollection extends Backbone.Collection
  model: User

  ## Url where user lives.
  url: '/platform/user/'
  
  ## Select which field from backend response to use for parsing to populate  
  ## collection.
  parse: (response) ->
    response.rows


