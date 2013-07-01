CollectionView = require '../lib/view_collection'
MicropostCollection = require '../collections/micropost_collection'
MicropostView = require '../views/micropost_view'
Micropost = require '../models/micropost'

module.exports = class MicropostListView extends CollectionView
    collection: new MicropostCollection()
    view: MicropostView

    template: ->
        require('./templates/micropost_list')

    afterRender: ->
        @$el.addClass 'micropost-list mod left w100'

    prependMicropost: (micropost) =>
        @renderOne micropost, prepend: true

    loadTag: (tag) ->
        @tag = tag
        lastDate = moment()
        date = lastDate.format('YYYY-MM-DD') + '-23-59-00/'
        @remove @views, silent: true
        @views = []
        @collection.url = @collection.baseUrl + date
        @collection.url += "tags/#{@tag}/"
        @collection.fetch
            success: (microposts) =>
                console.log 'success'
                console.log @views


                if @views.length is 0
                    microposts.models.slice()
                    @renderOne micropost for micropost in microposts.models

    loadMore: ->
        @collection.url = @collection.baseUrl + @getLastDate()
        @collection.url += "tags/#{@tag}/" if @tag?
        @collection.fetch
            success: (microposts) =>
                microposts.models.slice()
                @renderOne micropost for micropost in microposts.models
            error: =>
                alert 'server error occured'

    getLastDate: ->
        micropost = @collection.last()
        if micropost?
            lastDate = moment micropost.get 'date'
            return lastDate.format('YYYY-MM-DD') + '-23-59-00/'
        else
            lastDate = moment()
        return lastDate.format('YYYY-MM-DD') + '-23-59-00/'
