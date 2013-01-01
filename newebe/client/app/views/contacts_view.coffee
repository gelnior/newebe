View = require '../lib/view'

module.exports = class ContactsView extends View
    id: 'contacts-view'

    template: ->
        require('./templates/contacts')

    afterRender: ->
