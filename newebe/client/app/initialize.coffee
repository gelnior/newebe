# App Namespace
# Change `CozyApp` to your app's name

@Newebe ?= {}
Newebe.routers ?= {}
Newebe.views ?= {}


$ ->
    # Load Jquery helpers
    addJqueryHelpers = require 'lib/jquery_helpers'
    addJqueryHelpers()

    # Load App Helpers
    require '../lib/app_helpers'
    AppRouter = require 'routers/app_router'
    AppView = require 'views/app_view'

    # Initialize App
    Newebe.views.appView = new AppView()
    Newebe.routers.appRouter = new AppRouter Newebe.views.appView

    # Configure wysiwig editor
    etch.config.default = etch.config.all

    # Initialize Backbone History
    Backbone.history.start()
    if window.location.hash is ''
        Newebe.routers.appRouter.navigate '', trigger: true
