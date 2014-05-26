CollectionView = require '../lib/view_collection'
MicropostCollection = require '../collections/micropost_collection'
MicropostView = require '../views/micropost_view'
Micropost = require '../models/micropost'

module.exports = class MicropostListView extends CollectionView
    collection: new MicropostCollection()
    view: MicropostView

    template: ->
        require './templates/micropost_list'

    afterRender: ->
        @$el.addClass 'micropost-list mod left w100'

    prependMicropost: (micropost) =>
        @renderOne micropost, prepend: true

    loadTag: (tag) ->
        @tag = tag
        lastDate = moment()
        date = lastDate.format 'YYYY-MM-DD-HH-mm-ss/'
        @remove @views, silent: true
        @collection.reset()
        @views = []

        if tag isnt 'all'
            @collection.url = @collection.baseUrl + date
            @collection.url += "tags/#{@tag}/"
        else
            @collection.url = @collection.baseUrl

        @$el.spin 'small'
        @$el.css 'height', '50px'
        @collection.fetch
            success: (microposts) =>
                @$el.spin()
                @$el.css 'height', 'auto'
                if @views.length is 0
                    @renderOne micropost for micropost in microposts.models
            error: =>
                @$el.$el.spin()
                alert 'A server error occured while retrieving news feed'

    loadMore: (callback) ->
        collection = new MicropostCollection()
        collection.url = @collection.baseUrl + @getLastDate()
        collection.url += "tags/#{@tag}/" if @tag?
        collection.fetch
            success: (microposts) =>
                if microposts.size() < 11
                    Backbone.Mediator.publish 'posts:no-more', true
                for micropost in microposts.models
                    @renderOne micropost
                @setLastDate collection
                callback()
            error: =>
                alert 'server error occured'
                callback()

    setLastDate: (collection) ->
        activity = collection.last()
        if activity?
            lastDate = moment activity.get 'date'
            @lastDate = lastDate.utc().format('YYYY-MM-DD-HH-mm-SS') + '/'
        else
            @lastDate = ''

    getLastDate: ->
        if @lastDate?
            @lastDate
        else
            @setLastDate @collection
            @getLastDate()

    search: (query, callback) ->
        $.ajax
            url: "microposts/search/"
            type: 'POST'
            data: '{"query": "' + query + '"}'
            dataType: "json"
            success: (data) =>
                @collection.reset data.rows
                @reset()
                for micropost in @collection.models
                    @renderOne micropost
                callback()
            error: (data) =>
                alert 'error occured while fetching search results'
                callback()
