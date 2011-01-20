## Model for a single Micro Post
class MicroPost extends Backbone.Model

  #  Url where micro posts lives.
  url: '/news/microposts/'

  # Constructor initialize its field from a javascript raw object.
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

  setDisplayDateFromDbDate: (date) ->
    postDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ")
    stringDate = postDate.toString("dd MMM yyyy, HH:mm")
    @attributes['displayDate'] = stringDate
    postDate

  setDisplayDate: ->
    dateToSet = @attributes["date"]
    @setDisplayDateFromDbDate(dateToSet)

  getAuthor: ->
    @get('author')

  getDate: ->
    @get('date')

  getContent: ->
    @get('content')

  getDisplayDate: ->
     @attributes['displayDate']

  # Send a delete request to services backend then remove micro post view fro
  # app view.
  delete: ->
    @url += @id
    @destroy()
    @view.remove()

  # Micro post is considered as new if no author is set.
  isNew: ->
    !@getAuthor()

    

## Model for a Micro Post collection
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


