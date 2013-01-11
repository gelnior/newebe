module.exports = class AppRouter extends Backbone.Router
    routes:
        '': 'start'
        'activities': 'activities'
        'microposts': 'microposts'
        'contacts': 'contacts'
        'profile': 'profile'
        

    constructor: (@appView) ->
        super()

    start: -> @appView.checkUserState()
        
    activities: ->
        @loadSubView =>
            @appView.changeSubView @appView.activitiesView

    microposts: ->
        @loadSubView =>
            @appView.changeSubView @appView.micropostsView

    contacts: ->
        @loadSubView =>
            @appView.changeSubView @appView.contactsView

    profile: ->
        @loadSubView =>
            @appView.changeSubView @appView.profileView

    loadSubView: (callback) ->
        if @appView.isLoaded
            callback()
        else
            @appView.checkUserState =>
                @appView.displayMenu()
                callback()
