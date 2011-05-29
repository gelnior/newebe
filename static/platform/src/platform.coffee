# Build main view and common widgets

infoDialog = new InfoDialog
platformController = new PlatformController
platformView = new PlatformView(platformController)
registerView = new RegisterView
registerPasswordView = new RegisterPasswordView
loginView = new LoginView

loadingIndicator = new LoadingIndicator
Backbone.history.start()

