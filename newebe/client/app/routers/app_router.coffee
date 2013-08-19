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
        @checkAppViewState =>
            @appView.changeSubView @appView.micropostsView

    notes: ->
        @checkAppViewState =>
            @appView.changeSubView @appView.notesView

    contacts: ->
        @checkAppViewState =>
            @appView.changeSubView @appView.contactsView

    pictures: ->
        @checkAppViewState =>
            @appView.changeSubView @appView.picturesView

    profile: ->
        @checkAppViewState =>
            @appView.changeSubView @appView.profileView

    checkAppViewState: (callback) =>
        if @appView.isLoaded
            callback()
        else
            @appView.checkUserState =>
                @appView.displayMenu()
                callback()
