View = require '../lib/view'
CommonsView = require './commons'
Common = require '../models/common'

module.exports = class CommonsMainView extends View
    id: 'commons-view'

    events:
        "click #more-commons": "loadMoreCommons"

    template: ->
        require './templates/commons_view'

    afterRender: ->

    fetch: ->
        @commonsView ?= new CommonsView()
        @commonsView.fetch()
        @isLoaded = true

    loadMoreCommons: =>
        @commonsView.loadMore()
