## Model for a single Micro Post
class MicroPost extends Backbone.Model

  #  Url where micro posts lives.
  url: '/news/microposts/'

  # Constructor initializes its field from a javascript raw object.
  # Fields:
  #
  # * id : micro post date formatted to be used for micro post URI building.
  # * author : micro post author.
  # * date : micro post publish date.  
  # * content : micro post content.
  constructor: (microPost) ->
    super

    @set('author', microPost.author)
    @set('content', microPost.content)
    @set('authorKey', microPost.authorKey)

    if microPost.date
      postDate = @setDisplayDateFromDbDate(microPost.date)

      idDate = postDate.toString("yyyy-MM-dd-HH-mm-ss")
      @id =  idDate + "/"

  ### Getters / Setters ###

  getDisplayDate: ->
     @attributes['displayDate']

  setDisplayDate: ->
    dateToSet = @attributes["date"]
    @setDisplayDateFromDbDate(dateToSet)
  
  # Convert raw *date* to human readable date.
  setDisplayDateFromDbDate: (date) ->
    postDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ")
    stringDate = postDate.toString("dd MMM yyyy, HH:mm")
    @attributes['displayDate'] = stringDate
    postDate
  

  getAuthor: ->
    @get('author')

  getDate: ->
    @get('date')

  getContent: ->
    @get('content')

  # Sends a delete request to services backend then ask view to remove micro 
  # post view.
  delete: ->
    @url += @id
    @destroy()
    @view.remove()

  # Micro post is considered as new if no author is set.
  isNew: ->
    !@getAuthor()

    

## Micro Post collection
class MicroPostCollection extends Backbone.Collection
  model: MicroPost

  # Url where micro posts lives.
  url: '/news/microposts/'

  # Collection sorting is based on post publsh date.
  comparator: (microPost) ->
    microPost.getDate()

  # Select which field from backend response to use for parsing to populate  
  # collection.
  parse: (response) ->
    response.rows


