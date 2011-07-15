## Model for a single Activity
class Activity extends Backbone.Model


  #  Url where activities can be retrieved.
  url: '/activities/all/'

  # Constructor initializes its field from a javascript raw object.
  # Fields:
  #
  # * id : activity id in database.
  # * author : actvity author.
  # * date : date where activity occcured.
  # * docId : Id of the document linked to the activity.
  # * verb : Verb describing the activity.
  # * docType : Type of the doc linked to the activity.
  # * method : HTTP method used by the query from where activity comes.
  # * errors : list of errors that occurs for this activity (list of contacts
  #            that did not received the data linked to the activity).
  # * errorNumber : Number of errors that occured (*errors* length).
  # * mid : activity id.
  # * urlDate : date where activity occured transformed at the URL format.

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
    @set('mid', activity._id)
    @attributes['mid'] = activity._id
    @setDisplayDate()
    @id = activity._id
   
    if activity.date
      activityDate = Date.parseExact(activity.date, "yyyy-MM-ddTHH:mm:ssZ")
      urlDate = activityDate.toString("yyyy-MM-dd-HH-mm-ss/")
      @attributes['urlDate'] = urlDate
     
    if activity.errors.length
      @attributes['errorNumber'] = "(" + activity.errors.length + ")"
    else
      @attributes['errorNumber'] = ""


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

  getAuthorKey: ->
    @get('authorKey')

  getDate: ->
    @get('date')

  getUrlDate: ->
    @attributes['urlDate']

  getDocType: ->
    @attributes['docType']

  getDocId: ->
    @get('docId')

  getMethod: ->
    @get('method')

  getMid: ->
    @get('mid')

  getErrors: ->
    @get('errors')


## Activity collection
class ActivityCollection extends Backbone.Collection
  model: Activity

  # Url where activities can be retrieved.
  url: '/activities/all/'

  # Collection sorting is based on activity date.
  comparator: (activity) ->
    activity.getDate()

  # Select which field from backend response to use for parsing to populate  
  # collection.
  parse: (response) ->
    response.rows


