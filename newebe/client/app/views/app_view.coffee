View      = require '../lib/view'
AppRouter = require '../routers/app_router'

module.exports = class AppView extends View
    el: 'body.application'

    template: ->
        require('./templates/home')

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()
