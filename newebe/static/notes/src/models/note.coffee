## Model for a single Note
class Note extends Backbone.Model

  #  Url where notes lives.
  url: '/notes/all/'

  # Constructor initializes its field from a javascript raw object.
  # Fields:
  #
  # * id : note id in database.
  # * author : note author.
  # * date : creation date.  
  # * date : last modification date.  
  # * content : micro post content.
  constructor: (note) ->
    super

    @id = note._id
    @set('noteId', note._id)
    @set('author', note.author)
    @set('title', note.title)
    @set('date', note.date)
    @set('content', note.content)
    @set('lastModified', note.lastModified)

    content = note.content.replace(/<(?:.|\s)*?>/g, "")
    @attributes['content'] = content
    @attributes['lastModified'] = note.lastModified
    
    @setDisplayDate()

    if @id
      @url = "/notes/" + @id + "/"
    else
      @url = "/notes/all/"

    
  ### Getters / Setters ###

  setId: (id) ->
    @id = id
    @url = "/notes/" + @id + "/"

  getDisplayDate: ->
    @attributes['displayDate']

  # Convert last modified date to a human readable format.
  setDisplayDate: ->
    dateToSet = @attributes["lastModified"]
    @setDisplayDateFromDbDate(dateToSet)
  
  # Convert raw *date* to human readable date.
  setDisplayDateFromDbDate: (date) ->
    displayDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ")
    stringDate = displayDate.toString("dd MMM yyyy, HH:mm")
    @attributes['displayDate'] = stringDate
    stringDate

  getAuthor: ->
    @get('author')
  
  getTitle: ->
    @get('title')
  
  setTitle: (title) ->
    @attributes['title'] = title
    @set('title', title)

  getDate: ->
    @get('date')

  setDate: (date) ->
    @set('title', date)

  getContent: ->
    @get('content')

  setContent: (content) ->
    @attributes['content'] = content
    @set('content', content)
  

  # Sends a delete request to services backend then ask view to remove note 
  # from DOM.
  delete: ->
    @url = "/notes/" + @id + "/"
    @destroy()
    @view.remove()

  # Note is considered as new if no id is set.
  isNew: ->
    !@id


## Note collection
class NoteCollection extends Backbone.Collection
  model: Note

  # Url where notes lives.
  url: '/notes/all/'

  # Select which field from backend response to use for parsing to populate  
  # collection.
  parse: (response) ->
    response.rows


