View = require '../lib/view'
PicturesView = require './pictures'
Picture = require '../models/picture'

module.exports = class PicturesMainView extends View
    id: 'pictures-view'

    events:
        "click #more-pictures": "loadMorePictures"

    template: ->
        require './templates/pictures_view'

    afterRender: ->

    fetch: ->
        @picturesView ?= new PicturesView()
        @picturesView.fetch()
        @isLoaded = true

    loadMorePictures: =>
        @picturesView.loadMore()
