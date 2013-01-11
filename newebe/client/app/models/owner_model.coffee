# Model for newebe owner
module.exports = class Owner extends Backbone.Model

    url: '/user/'

    # User is never new.
    isNew: ->
        false
