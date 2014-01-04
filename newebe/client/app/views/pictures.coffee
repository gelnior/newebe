CollectionView = require '../lib/view_collection'
PictureView = require './picture'
PicturesCollection = require '../collections/pictures'
NoteView = require './note'

module.exports = class PicturesView extends CollectionView
    el: '#pictures'

    collection: new PicturesCollection()
    view: PictureView

    template: ->
        require './templates/pictures'

    constructor: (collection) ->
        super
        @rendered = 0

    afterRender: ->

    fetch: ->
        @collection.fetch()

    renderOne: (model, options) =>
        super model, options
        @rendered++
        if @rendered % 3 is 0
            @$el.append '<div class="line clearfix"></div>'
