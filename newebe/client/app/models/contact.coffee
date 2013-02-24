Model = require 'lib/model'
request = require 'lib/request'

module.exports = class ContactModel extends Model

    urlRoot: 'contacts/'
    idAttribute: 'slug'

    retry: (callback) ->
        data = slug: @get "slug"
        request.post "/contacts/#{@get("slug")}/retry/", data, (err, contact) =>
            console.log contact
            
            @set 'state', 'Pending' unless err
            err = error: true if contact.state is 'Error'
            callback err
    
    accept: (callback) ->
        @save {},
            success: =>
                @set 'state', 'Trusted'
                callback()
            error: =>
                @set 'state', 'Error'
                callback error: true
