## News application entry point

# Builds news app view, inits widgets and listeners, retrieves last microposts
# and displays them.
app = new CommonsView
commonRouter = new CommonsRouter app

# Common tools
loadingIndicator = new LoadingIndicator
confirmationDialog = new ConfirmationDialog
infoDialog = new InfoDialog
selectorDialogCommon = new DocumentSelector

# Initialize widgets
app.setWidgets()
app.setListeners()

app.displayAllCommons null

