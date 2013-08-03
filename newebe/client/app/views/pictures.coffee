CollectionView = require '../lib/view_collection'
PicturesCollection = require '../collections/pictures'
NoteView = require './note'

module.exports = class PicturesView extends CollectionView
    el: '#pictures'

    collection: new PicturesCollection()
    view: PictureView

    template: ->
        require './templates/pictures'

    afterRender: ->

    fetch: ->
        @collection.fetch()
