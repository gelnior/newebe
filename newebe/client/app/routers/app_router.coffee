module.exports = class AppRouter extends Backbone.Router

    routes:
        '': 'start'
        'microposts': 'microposts'
        'notes': 'notes'
        'contacts': 'contacts'
        'profile': 'profile'


    constructor: (@appView) ->
        super()

    start: -> @appView.checkUserState()

    microposts: ->
        @loadSubView @appView.micropostsView

    notes: ->
        @loadSubView @appView.notesView

    contacts: ->
        @loadSubView @appView.contactsView

    pictures: ->
        @loadSubView @appView.picturesView

    profile: ->
        @loadSubView @appView.profileView

    # We do not render the page the same way if it is the first page loading
    # or if main app has been already rendered.
    loadSubView: (view) ->
        callback = =>
            @appView.changeSubView view

        if @appView.isLoaded
            callback()
        else
            @appView.checkUserState =>
                @appView.displayMenu()
                callback()
