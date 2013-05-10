module.exports = class AppRouter extends Backbone.Router

    routes:
        '': 'start'
        'activities': 'activities'
        'notes': 'notes'
        'contacts': 'contacts'
        'profile': 'profile'


    constructor: (@appView) ->
        super()

    start: -> @appView.checkUserState()

    activities: ->
        @loadSubView =>
            @appView.changeSubView @appView.activitiesView

    notes: ->
        @loadSubView =>
            @appView.changeSubView @appView.notesView

    contacts: ->
        @loadSubView =>
            @appView.changeSubView @appView.contactsView

    profile: ->
        @loadSubView =>
            @appView.changeSubView @appView.profileView

    # We do not render the page the same way if it is the first page loading
    # or if main app has been already rendered.
    loadSubView: (callback) ->
        if @appView.isLoaded
            callback()
        else
            @appView.checkUserState =>
                @appView.displayMenu()
                callback()
