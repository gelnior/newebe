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

    loadMore: ->
        @collection.url = @collection.baseUrl + @getLastDate()
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
            return ''
