## Platform Controller

# Platform controller Handle URL routes, it allows to display applications
# set in the URL.
class PlatformController extends Backbone.Controller

    routes: {
      "contact":  "displayContact",
      "news":  "displayNews",
      "profile":  "displayProfile",
    }

    displayContact: () ->
      @view.onContactClicked(null)
      
    displayNews: () ->
      @view.onNewsClicked(null)
      
    displayProfile: () ->
      @view.onProfileClicked(null)
      
    registerView: (view) ->
      @view = view


