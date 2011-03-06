## News application entry point

# Builds news app view, inits widgets and listeners, retrieves last microposts
# and displays them.
newsApp = new NewsView

loadingIndicator = new LoadingIndicator
confirmationDialog = new ConfirmationDialog


newsApp.setWidgets()
newsApp.setListeners()
newsApp.clearPostField()

newsApp.fetch()

# Sets up real time updater to display incoming news without refresh.
updater =
 errorSleepTime: 500
 cursor: null

 poll: () ->
   $.ajax(
     url: "/news/suscribe/"
     type: "GET"
     dataType: "text"
     success: updater.onSuccess,
     error: updater.onError
   )
    
 onSuccess: (response) ->
   try
    if response
      micropost = new MicroPost eval('(' + response+ ')')
      newsApp.prependOne(micropost)
   catch e
     updater.onError()
     return
     
   updater.errorSleepTime = 500
   window.setTimeout(updater.poll, 0)
    

 onError: (response) ->
  updater.errorSleepTime *= 2
  window.setTimeout(updater.poll, updater.errorSleepTime)

updater.poll()

