## Common Router
#
# Router for common application.


class CommonsRouter extends Backbone.Router

  routes:
    "": "all"
    "commons": "all"
    #"commons/": "all"
    "commons/all/": "all"
    "commons/all/until/:date/": "all"
    "commons/mine/": "mine"
    "commons/mine/until/:date/": "mine"
    "commons/mine/:id/": "mineWithSelection"

  constructor: (view) ->
    super

    @view = view

  all: (date) ->
    @view.displayAllCommons date

  mine: (date) ->
    @view.displayMyCommons date
  
  mineWithSelection: (id) ->
    @view.lastSelectedId = id
    @view.displayMyCommons null


