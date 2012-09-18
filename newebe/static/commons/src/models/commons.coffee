## Model for a single Micro Post
class Common extends Backbone.Model

  #  Url where micro posts lives.
  url: '/commons/all/'

  # Constructor initializes its field from a javascript raw object.
  # 
  # Specific fields are build : thumnbail path, image path, url date (for 
  # building server request path), display date.
  #
  constructor: (common) ->
    super

    @set('author', common.author)
    @set('authorKey', common.authorKey)
    @set('_id', common._id)
    @set('path', common.path)
    @id = common._id

    @setImgPath()
    @setThumbnailPath()
    if common.date
      date = Date.parseExact(common.date, "yyyy-MM-ddTHH:mm:ssZ")
      @attributes['urlDate'] = date.toString("yyyy-MM-dd-HH-mm-ss")
      @attributes['displayDate'] = date.toString("dd MMM yyyy, HH:mm")

    
  ### Getters / Setters ###

  getUrlDate: () ->
    @attributes['urlDate']

  getDisplayDate: ->
    @attributes['displayDate']

  # Buid image path from common id and file name.
  setImgPath: ->
    @set('imgPath', "/commons/#{@id}/#{@get('path')}")
    @attributes['imgPath'] = "/commons/#{@id}/#{@get('path')}"

  # Buid thumbnail path from common id and file name.
  setThumbnailPath: ->
    @set('thumnbailPath', "/commons/#{@id}/th_#{@get('path')}")
    @attributes['thumbnailPath'] =
        "/commons/#{@id}/th_#{@get('path')}"
  
  # Returns server path where common template is located.
  getPath: ->
    "/commons/#{@id}/html/"
   
  # Returns server path where download request must be sent.
  getDownloadPath: ->
    "/commons/#{@id}/download/"
   
  getImagePreviewPath: ->
    "/commons/#{@id}/prev_#{@get('path')}"


  # Sends a delete request to services backend then ask view to remove micro 
  # post view.
  delete: ->
    @url = "/commons/" + @id + "/"
    @destroy()
    @view.remove()

  # Common is considered as new if no author is set.
  isNew: ->
    !@id

    

## Common collection
class CommonCollection extends Backbone.Collection
  model: Common

  # Url where micro posts lives.
  url: '/commons/all/'

  # Collection sorting is based on post publsh date.
  comparator: (common) ->
    date = Date.parseExact(common.date, "yyyy-MM-ddTHH:mm:ssZ")
    date

  # Select which field from backend response to use for parsing to populate  
  # collection.
  parse: (response) ->
    response.rows


