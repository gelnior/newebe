
# models


describe 'picture app', ->

  pic = new Picture
    author: "author"
    key: "key"
    _id: "1234"
    path: "path.jpg"
    title: "test title"
    date: "2011-12-06T20:38:47Z"


  describe 'models', ->
    it 'Image path is properly built in constructor', ->
      expect(pic.get('imgPath')).toBe('/pictures/1234/path.jpg')

    it 'Thumbnail path is properly built in constructor', ->
      expect(pic.get('thumbnailPath')).toBe(
          '/pictures/1234/th_path.jpg')

    it 'Display date is properly built in constructor', ->
      expect(pic.getDisplayDate()).toBe('06 Dec 2011, 20:38')


  describe 'rows', ->
    row = new PictureRow pic, app
    $("#pictures-list").append(row.render())

    it 'Image path is properly built in constructor', ->
      expect(pic.get('imgPath')).toBe('/pictures/1234/path.jpg')
      expect($('#' + pic._id)).not.toBe(null)

    it 'Image is correctly rendered', ->
      expect($('#' + pic._id)).not.toBe(null)

    it 'has mouseover class when mouse is over the row', ->
      row.onMouseOver()
      expect($(row.el).hasClass("mouseover")).toBe(true)
        
    it 'has not mouseover class when is out the row', ->
      row.onMouseOut()
      expect($(row.el).hasClass("mouseover")).not.toBe(true)

    it 'has right class when is selected', ->
      $(row.el).addClass("mouseover")
      row.select()
      expect($(row.el).hasClass("selected")).toBe(true)
      expect($(row.el).hasClass("mouseover")).not.toBe(true)

    it 'has not selected class when is selected', ->
      row.deselect()
      expect($(row.el).hasClass("selected")).not.toBe(true)

    it 'is null when is removed', ->
      row.remove()
      expect($(row.el).parent()).toBeNull()

  describe 'main view', ->
    happy = true

