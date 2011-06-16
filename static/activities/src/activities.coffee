## News application entry point

# Builds activities app view, inits widgets and listeners, retrieves last 
# activities and displays them.

loadingIndicator = new LoadingIndicator
confirmationDialog = new ConfirmationDialog
infoDialog = new InfoDialog

activitiesApp = new ActivitiesView
activitiesApp.setWidgets()
activitiesApp.setListeners()
activitiesApp.fetch()

