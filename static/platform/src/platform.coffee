# Build main view and common widgets
infoDialog = new InfoDialog
platformController = new PlatformController
platformView = new PlatformView(platformController)
loadingIndicator = new LoadingIndicator

# Build view loaded when registering is need 
registerView = new RegisterView
registerPasswordView = new RegisterPasswordView

# Build view loaded when logging in is need 
loginView = new LoginView

Backbone.history.start()

