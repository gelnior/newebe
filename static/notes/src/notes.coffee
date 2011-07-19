## News application entry point

# Builds notess app view, inits widgets and listeners, retrieves last notes
# and displays them.
notesApp = new NotesView

loadingIndicator = new LoadingIndicator
confirmationDialog = new ConfirmationDialog

notesApp.setWidgets()
notesApp.setListeners()

notesApp.reloadNotes()


