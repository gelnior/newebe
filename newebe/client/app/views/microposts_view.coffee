View = require '../lib/view'

module.exports = class MicropostsView extends View
    id: 'microposts-view'

    template: ->
        require('./templates/microposts')

    afterRender: ->
        @isLoaded = true
