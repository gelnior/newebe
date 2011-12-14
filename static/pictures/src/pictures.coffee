## News application entry point

# Builds news app view, inits widgets and listeners, retrieves last microposts
# and displays them.
app = new PicturesView
pictureRouter = new PicturesRouter app

loadingIndicator = new LoadingIndicator
confirmationDialog = new ConfirmationDialog
infoDialog = new InfoDialog

app.setWidgets()
app.setListeners()

#app.fetchData()



