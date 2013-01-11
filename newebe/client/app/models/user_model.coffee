# Model for newebe owner
class Owner extends Backbone.Model

    url: '/user/'

    # User is never new.
    isNew: ->
        false
