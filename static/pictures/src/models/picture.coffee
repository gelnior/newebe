## Model for a single Micro Post
class Picture extends Backbone.Model

  #  Url where micro posts lives.
  url: '/pictures/last/'

  # Constructor initializes its field from a javascript raw object.
  # Fields:
  #
  constructor: (picture) ->
    super

    @set('author', picture.author)
    @set('authorKey', picture.authorKey)
    @set('_id', picture._id)
    @set('path', picture.path)
    @id = picture._id

    @setImgPath()
    if picture.date
      #postDate = Date.parseExact(picture.date, "yyyy-MM-ddTHH:mm:ssZ")
      @setDisplayDateFromDbDate()

    
  ### Getters / Setters ###

  setImgPath: ->
    @set('imgPath', "/pictures/#{@id}/#{@get('path')}")
    @attributes['imgPath'] = "/pictures/#{@id}/#{@get('path')}"

  getDisplayDate: ->
    @attributes['displayDate']

  setDisplayDate: ->
    dateToSet = @attributes["date"]
    @setDisplayDateFromDbDate(dateToSet)
  
  # Convert raw *date* to human readable date.
  setDisplayDateFromDbDate: (date) ->
    if date
      postDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ")
      stringDate = postDate.toString("dd MMM yyyy, HH:mm")
      @attributes['displayDate'] = stringDate
      postDate
    date
  
  # Sends a delete request to services backend then ask view to remove micro 
  # post view.
  delete: ->
    @url = "/pictures/" + @id + "/"
    @destroy()
    @view.remove()

  # Picture is considered as new if no author is set.
  isNew: ->
    !@getAuthor()

    

## Picture collection
class PictureCollection extends Backbone.Collection
  model: Picture

  # Url where micro posts lives.
  url: '/pictures/last/'

  # Collection sorting is based on post publsh date.
  comparator: (picture) ->
    date = Date.parseExact(picture.date, "yyyy-MM-ddTHH:mm:ssZ")
    date

  # Select which field from backend response to use for parsing to populate  
  # collection.
  parse: (response) ->
    response.rows


