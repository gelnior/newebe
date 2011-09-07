## Contact

# Model for a single Contact

class Contact extends Backbone.Model

  #  Url where contacts lives.
  url: '/contacts/'

  # Constructors initialize its field from a javascript raw object.
  #
  # Fields:
  #
  # * url : contact URL.
  # * state : contact request state.
  constructor: (contact) ->
    super

    @set('url', contact.url)
    @set('name', contact.name)
    @set('cid', contact.key)
    @id = contact.slug + "/"
    if contact.state
      @set('state', contact.state)

  ### Accessors / Editors ###

  getUrl: ->
    @get('url')

  getState: ->
    @get('state')

  setState: (state) ->
    @set('state', state)


  # Sends a delete request to services backend then removes contact row from
  # contact view.
  delete: ->
    @url = '/contacts/' + @id
    @destroy()
    @view.remove()

  # Sends a POST request to services backend to ask for confirmation for this
  # contact.
  saveToDb: ->
    @url = '/contacts/' + @id
    @save(null,
      success: (model, response) ->
        model.setState("Trusted")
        model.view.refresh("Trusted")
        true
      error: (model, response) ->
        model.setState("Error")
        model.view.refresh("Error")
        true
    )
    @url

  # Contact is considered as new if no state is set.
  isNew: ->
    !@getState()

    

### Model for a Micro Post collection ###

class ContactCollection extends Backbone.Collection
  model: Contact

  # Url where contacts lives.
  url: '/contacts/'

  # Collection sorting is based on contact URI.
  comparator: (contact) ->
    contact.getUrl()

  # Select which field from backend response to use for populating  
  # collection.
  parse: (response) ->
    response.rows


