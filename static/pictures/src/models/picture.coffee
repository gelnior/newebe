## Model for a single Micro Post
class Picture extends Backbone.Model

  #  Url where micro posts lives.
  url: '/pictures/all/'

  # Constructor initializes its field from a javascript raw object.
  # 
  # Specific fields are build : thumnbail path, image path, url date (for 
  # building server request path), display date.
  #
  constructor: (picture) ->
    super

    @set('author', picture.author)
    @set('authorKey', picture.authorKey)
    @set('_id', picture._id)
    @set('path', picture.path)
    @id = picture._id

    @setImgPath()
    @setThumbnailPath()
    if picture.date
      date = Date.parseExact(picture.date, "yyyy-MM-ddTHH:mm:ssZ")
      @attributes['urlDate'] = date.toString("yyyy-MM-dd-HH-mm-ss")
      @attributes['displayDate'] = date.toString("dd MMM yyyy, HH:mm")

    
  ### Getters / Setters ###

  getUrlDate: () ->
    @attributes['urlDate']

  getDisplayDate: ->
    @attributes['displayDate']

  # Buid image path from picture id and file name.
  setImgPath: ->
    @set('imgPath', "/pictures/#{@id}/#{@get('path')}")
    @attributes['imgPath'] = "/pictures/#{@id}/#{@get('path')}"

  # Buid thumbnail path from picture id and file name.
  setThumbnailPath: ->
    @set('thumnbailPath', "/pictures/#{@id}/th_#{@get('path')}")
    @attributes['thumbnailPath'] =
        "/pictures/#{@id}/th_#{@get('path')}"
  
  # Returns server path where picture template is located.
  getPath: ->
    "/pictures/" + @get("_id") + "/html/"
   
  # Returns server path where download request must be sent.
  getDownloadPath: ->
    "/pictures/" + @get("_id") + "/download/"
   
  getImagePreviewPath: ->
    "/pictures/#{@id}/prev_#{@get('path')}"


  # Sends a delete request to services backend then ask view to remove micro 
  # post view.
  delete: ->
    @url = "/pictures/" + @id + "/"
    @destroy()
    @view.remove()

  # Picture is considered as new if no author is set.
  isNew: ->
    !@id

    

## Picture collection
class PictureCollection extends Backbone.Collection
  model: Picture

  # Url where micro posts lives.
  url: '/pictures/all/'

  # Collection sorting is based on post publsh date.
  comparator: (picture) ->
    date = Date.parseExact(picture.date, "yyyy-MM-ddTHH:mm:ssZ")
    date

  # Select which field from backend response to use for parsing to populate  
  # collection.
  parse: (response) ->
    response.rows


