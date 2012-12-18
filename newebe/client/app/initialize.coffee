# App Namespace
# Change `CozyApp` to your app's name
@CozyApp ?= {}
CozyApp.Routers ?= {}
CozyApp.Views ?= {}
CozyApp.Models ?= {}
CozyApp.Collections ?= {}

$ ->
    # Load App Helpers
    require '../lib/app_helpers'

    # Initialize App
    CozyApp.Views.appView = new AppView = require 'views/app_view'
    CozyApp.Views.appView.render()

    # Initialize Backbone History
    Backbone.history.start pushState: yes
