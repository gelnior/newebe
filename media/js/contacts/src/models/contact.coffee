### Model for a single Contact
###

class Contact extends Backbone.Model

  ##  Url where contacts lives.
  url: '/platform/contacts/'

  ## Constructor initialize its field from a javascript raw object.
  ## Fields:
  ## url : contact URL.
  ## state : contact request state.
  constructor: (contact) ->
    super

    @set('url', contact.url)
    @id = contact.slug + "/"
    if contact.state
      @set('state', contact.state)


  getUrl: ->
    @get('url')

  getState: ->
    @get('state')

  # Send a delete request to services backend then remove contact row from
  # contact view.
  delete: ->
    @url += @id
    @destroy()
    @view.remove()


  # Contact is considered as new if no state is set.
  isNew: ->
    !@getState()

    

### Model for a Micro Post collection
###

class ContactCollection extends Backbone.Collection
  model: Contact

  ## Url where contacts lives.
  url: '/platform/contacts/'

  ## Collection sorting is based on contact URI.
  comparator: (contact) ->
    contact.getUrl()

  ## Select which field from backend response to use for parsing to populate  
  ## collection.
  parse: (response) ->
    response.rows


