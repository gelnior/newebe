### News application entry point
###

## 
# Build news app view, then init widgets and listeners. Finally retrive data
# and displays it.
newsApp = new NewsView

newsApp.setWidgets()
newsApp.setListeners()
newsApp.clearPostField()

newsApp.fetch()
