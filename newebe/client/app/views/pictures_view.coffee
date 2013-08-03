View = require '../lib/view'
PicturesView = require './pictures'
Picture = require '../models/picture'

module.exports = class PicturesMainView extends View
    id: 'pictures-view'

    events:
        'click #add-picture': 'onAddNoteClicked'
        'click #sort-date-picture': 'onSortDateClicked'
        'click #sort-title-picture': 'onSortTitleClicked'

    template: ->
        require './templates/pictures_view'

    afterRender: ->

    fetch: ->
        @picturesView ?= new PicturesView()
        @picturesView.fetch()
        @isLoaded = true
