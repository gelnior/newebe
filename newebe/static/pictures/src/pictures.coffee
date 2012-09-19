## News application entry point

# Builds news app view, inits widgets and listeners, retrieves last microposts
# and displays them.
app = new PicturesView
pictureRouter = new PicturesRouter app

# Common tools
loadingIndicator = new LoadingIndicator
confirmationDialog = new ConfirmationDialog
infoDialog = new InfoDialog
selectorDialogPicture = new DocumentSelector

# Initialize widgets
app.setWidgets()
app.setListeners()

app.displayAllPictures null

