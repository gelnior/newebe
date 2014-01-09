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
            success: (pictures) =>
                @renderAll pictures.models

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

        for model in models
            if rendered % 3 is 0
                @currentRow = $ '<div class="row"></div>'
                @$el.append @currentRow
            @renderOne model
            rendered++
        @

    loadMore: ->
        $("#more-pictures").spin 'small'
        collection = new PicturesCollection()
        collection.url = @collection.url + @getLastDate()
        collection.fetch
            success: (pictures) =>
                @renderAll pictures.models
                @setLastDate collection
                $("#more-pictures").spin()
                if pictures.length < 12
                    $("#more-pictures").hide()

            error: =>
                alert 'server error occured'

    setLastDate: (collection) ->
        picture = collection.last()
        if picture?
            lastDate = moment picture.get 'date'
            @lastDate = lastDate.utc().format('YYYY-MM-DD-HH-mm-SS') + '/'
        else
            @lastDate = ''

    getLastDate: ->
        if @lastDate?
            @lastDate
        else
            @setLastDate @collection
            @getLastDate()
