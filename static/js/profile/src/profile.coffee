### Profile application entry point
###

## 
# Build profile app view, then init widgets and listeners. Finally retrieve data
# and displays it.
profileApp = new ProfileView

profileApp.setWidgets()
profileApp.setListeners()

profileApp.fetch()
      
