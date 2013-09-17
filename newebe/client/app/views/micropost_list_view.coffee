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
        date = lastDate.format('YYYY-MM-DD-HH-mm-ss/')
        @remove @views, silent: true
        @views = []
        @collection.url = @collection.baseUrl + date
        @collection.url += "tags/#{@tag}/"
        @$el.spin 'small'
        @collection.fetch
            success: (microposts) =>
                @$el.spin()
                if @views.length is 0
                    microposts.models.slice()
                    @renderOne micropost for micropost in microposts.models

    loadMore: (callback) ->
        @collection.url = @collection.baseUrl + @getLastDate()
        @collection.url += "tags/#{@tag}/" if @tag?
        @collection.fetch
            success: (microposts) =>
                if microposts.size() < 11
                    Backbone.Mediator.publish 'posts:no-more', true
                callback()
            error: =>
                alert 'server error occured'
                callback()

    getLastDate: ->
        micropost = @collection.last()
        if micropost?
            lastDate = moment micropost.get 'date'
            return lastDate.format('YYYY-MM-DD-HH-mm-ss/')
        else
            lastDate = moment()
        return lastDate.format('YYYY-MM-DD') + '-23-59-00/'
