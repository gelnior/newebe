module.exports = class ContactsCollection extends Backbone.Collection
    model: require '../models/contact'
    url: 'contacts/'

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows
        
    containsContact: (contactUrl) ->
        @find (contact) -> contactUrl is contact.get "url"
