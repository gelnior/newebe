CollectionView = require '../lib/view_collection'
CommonView = require './common'
CommonsCollection = require '../collections/commons'
NoteView = require './note'

module.exports = class CommonsView extends CollectionView
    el: '#commons'

    collection: new CommonsCollection()
    view: CommonView

    template: ->
        require './templates/commons'

    constructor: (collection) ->
        super
        @rendered = 0

    afterRender: ->

    fetch: ->
        @collection.off 'add'
        @collection.fetch
            success: (commons) =>
                @renderAll commons.models

    renderAll: (models) ->
        @renderOne model for model in models
        @


    loadMore: ->
        $("#more-commons").spin 'small'
        collection = new CommonsCollection()
        collection.url = @collection.url + @getLastDate()
        collection.fetch
            success: (commons) =>
                console.log commons

                @renderAll commons.models
                @setLastDate collection
                $("#more-commons").spin()
                if commons.length < 12
                    $("#more-commons").hide()

            error: =>
                alert 'server error occured'

    setLastDate: (collection) ->
        common = collection.last()
        if common?
            lastDate = moment common.get 'date'
            @lastDate = lastDate.utc().format('YYYY-MM-DD-HH-mm-SS') + '/'
        else
            @lastDate = ''

    getLastDate: ->
        if @lastDate?
            @lastDate
        else
            @setLastDate @collection
            @getLastDate()
