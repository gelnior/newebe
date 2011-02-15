## Contact application entry point ##

# Build news app view, init widgets and listeners, retrieves contact
# data and displays it.

infoDialog = new InfoDialog
loadingIndicator = new LoadingIndicator
contactApp = new ContactView

contactApp.setWidgets()
contactApp.setListeners()
contactApp.clearPostField()

contactApp.fetch()


