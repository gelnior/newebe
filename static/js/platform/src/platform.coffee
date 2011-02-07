##
# Build platform view and set listeners.

infoDialog = new InfoDialog
platformController = new PlatformController
platformView = new PlatformView(platformController)
registerView = new RegisterView

loadingIndicator = new LoadingIndicator
Backbone.history.start()
