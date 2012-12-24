# App Namespace
# Change `CozyApp` to your app's name
@Newebe ?= {}
Newebe.routers ?= {}
Newebe.views ?= {}
Newebe.models ?= {}
Newebe.collections ?= {}

$ ->
    # Load App Helpers
    require '../lib/app_helpers'

    # Initialize App
    Newebe.views.appView = new AppView = require 'views/app_view'
    Newebe.views.appView.render()
    Newebe.views.appView.checkUserState()

    # Initialize Backbone History
    Backbone.history.start pushState: yes
