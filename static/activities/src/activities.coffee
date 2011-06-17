## News application entry point

# Create utility widgets

loadingIndicator = new LoadingIndicator
confirmationDialog = new ConfirmationDialog
infoDialog = new InfoDialog

# Builds activities app view, inits widgets and listeners, retrieves last 
# activities and displays them.

activitiesApp = new ActivitiesView
activitiesApp.setWidgets()
activitiesApp.setListeners()
activitiesApp.fetch()

