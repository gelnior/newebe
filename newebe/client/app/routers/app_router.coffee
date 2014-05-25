module.exports = class AppRouter extends Backbone.Router

    routes:
        '': 'start'
        'microposts': 'microposts'
        'pictures': 'pictures'
        'commons': 'commons'
        'notes': 'notes'
        'contacts': 'contacts'
        'profile': 'profile'
        'activities': 'activities'


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

    commons: ->
        @checkAppViewState =>
            @appView.changeSubView @appView.commonsView

    profile: ->
        @checkAppViewState =>
            @appView.changeSubView @appView.profileView

    activities: ->
        @checkAppViewState =>
            @appView.changeSubView @appView.activitiesView

    checkAppViewState: (callback) =>
        if @appView.isLoaded
            callback()
        else
            @appView.checkUserState =>
                @appView.displayMenu()
                callback()
