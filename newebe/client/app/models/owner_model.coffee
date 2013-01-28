request = require 'lib/request'
Model = require 'lib/model'

# Model for newebe owner
module.exports = class Owner extends Model

    url: '/user/'

    # Owner is never new.
    isNew: -> false

    newSesame: (sesame, callback) ->
        request.put "/user/password/", password: sesame, callback
