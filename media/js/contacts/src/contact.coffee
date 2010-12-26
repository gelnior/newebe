### Contact application entry point
###

## 
# Build news app view, then init widgets and listeners. Finally retrive data
# and displays it.
contactApp = new ContactView

contactApp.setWidgets()
contactApp.setListeners()
contactApp.clearPostField()

contactApp.fetch()
      
