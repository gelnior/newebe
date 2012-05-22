## Picture Router
#
# Router for picture application.


class PicturesRouter extends Backbone.Router

  routes:
    "": "all"
    "pictures": "all"
    #"pictures/": "all"
    "pictures/all/": "all"
    "pictures/all/until/:date/": "all"
    "pictures/mine/": "mine"
    "pictures/mine/until/:date/": "mine"
    "pictures/mine/:id/": "mineWithSelection"

  constructor: (view) ->
    super

    @view = view

  all: (date) ->
    if date
        @view.displayAllPictures date

  mine: (date) ->
    @view.displayMyPictures date
  
  mineWithSelection: (id) ->
    @view.lastSelectedId = id
    @view.displayMyPictures null


