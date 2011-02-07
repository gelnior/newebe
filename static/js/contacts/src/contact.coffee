### Contact application entry point ###


# Build news app view, then init widgets and listeners. Finally it retrieves 
# data and displays it.

infoDialog = new InfoDialog
loadingIndicator = new LoadingIndicator
contactApp = new ContactView

contactApp.setWidgets()
contactApp.setListeners()
contactApp.clearPostField()

contactApp.fetch()


