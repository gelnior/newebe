## Model for a single Activity
class Activity extends Backbone.Model


  #  Url where micro posts lives.
  url: '/activities/all/'

  # Constructor initializes its field from a javascript raw object.
  # Fields:
  #
  # * id : activity id in database.
  # * author : actvity post author.
  constructor: (activity) ->
    super

    @set('author', activity.author)
    @set('authorKey', activity.authorKey)
    @set('date', activity.date)
    @set('docId', activity.docId)
    @set('verb', activity.verb)
    @set('docType', activity.docType)
    @set('method', activity.method)
    @set('errors', activity.errors)

    @setDisplayDate()
    @id = activity._id
   
    if activity.date
      activityDate = Date.parseExact(activity.date, "yyyy-MM-ddTHH:mm:ssZ")
      urlDate = activityDate.toString("yyyy-MM-dd-HH-mm-ss/")
      @attributes['urlDate'] = urlDate
     
    @attributes['errorNumber'] = ""
    if activity.errors.length
      @attributes['errorNumber'] = "(" + activity.errors.length + ")"


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

  getUrlDate: ->
    @attributes['urlDate']

  getDocType: ->
    @attributes['docType']

  getDocId: ->
    @get('docId')

  getAuthorKey: ->
    @get('authorKey')


## Activity collection
class ActivityCollection extends Backbone.Collection
  model: Activity

  # Url where micro posts lives.
  url: '/activities/all/'

  # Collection sorting is based on post publsh date.
  comparator: (activity) ->
    activity.getDate()

  # Select which field from backend response to use for parsing to populate  
  # collection.
  parse: (response) ->
    response.rows


