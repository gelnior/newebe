## News application entry point

# Builds news app view, inits widgets and listeners, retrieves last microposts
# and displays them.
app = new PicturesView

loadingIndicator = new LoadingIndicator
confirmationDialog = new ConfirmationDialog

app.setWidgets()
app.setListeners()

app.fetchData()



