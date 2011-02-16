## News application entry point

# Builds news app view, inits widgets and listeners, retrieves last microposts
# and displays them.
newsApp = new NewsView

loadingIndicator = new LoadingIndicator

newsApp.setWidgets()
newsApp.setListeners()
newsApp.clearPostField()

newsApp.fetch()
