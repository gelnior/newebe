## Contact

# Model for a single Contact

class Contact extends Backbone.Model

  #  Url where contacts lives.
  url: '/contacts/all/'

  # Constructors initialize its field from a javascript raw object.
  #
  # Fields:
  #
  # * url : contact URL.
  # * state : contact request state.
  constructor: (contact) ->
    super(contact)

    @set('url', contact.url)
    @set('name', contact.name)
    @set('key', contact.key)
    @id = contact.slug + "/"
    @tags = contact.tags
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

  isTagged: (tag) ->
    for currentTag in @tags
      if currentTag == tag
        return true
    return false

  removeTag: (tag, callbacks) ->
    i = 0
    for currentTag in @tags
      if currentTag == tag
        break
      else
        i++
    @tags.splice i, 1
    @updateTags callbacks

  updateTags: (callbacks) ->
    $.ajax
      type: "PUT"
      url: "/contacts/" + @id + "tags/"
      data: '{"tags":["' + @tags.join("\", \"") + '"]}'
      success: callbacks.success
      error: callbacks.success

  # Contact is considered as new if no state is set.
  isNew: ->
    !@getState()


### Model for a Micro Post collection ###

class ContactCollection extends Backbone.Collection
  model: Contact

  # Url where contacts lives.
  url: '/contacts/all/'

  # Collection sorting is based on contact URI.
  comparator: (contact) ->
    contact.getUrl()

  # Select which field from backend response to use for populating  
  # collection.
  parse: (response) ->
    response.rows


