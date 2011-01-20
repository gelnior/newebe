### News application entry point
###

## 
# Build news app view, then init widgets and listeners. Finally retrieve data
# and displays it.
newsApp = new NewsView

loadingIndicator = new LoadingIndicator

newsApp.setWidgets()
newsApp.setListeners()
newsApp.clearPostField()

newsApp.fetch()
