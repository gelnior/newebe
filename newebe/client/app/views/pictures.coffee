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
        @collection.off 'add'
        @collection.fetch
            success: (models) =>
                console.log models
                @renderAll models


    renderOne: (model, options) =>
        view = new @view model
        if options?.prepend
            @currentRow.prepend view.render().el
        else
            @currentRow.append view.render().el
        @add view
        @

    renderAll: (models) =>
        rendered = 0
        @currentRow = $ '<div class="row"></div>'
        console.log @currentRow

        @collection.each (model) =>
            if rendered % 3 is 0
                @currentRow = $ '<div class="row"></div>'
                @$el.append @currentRow
            @renderOne model
            rendered++
        @

