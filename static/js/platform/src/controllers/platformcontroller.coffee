## Platform Controller

# Platform controller Handle URL routes, it allows to display applications
# set in the URL.
class PlatformController extends Backbone.Controller

    routes: {
      "contact":  "displayContact",
      "news":  "displayNews",
      "activities":  "displayActivities",
      "profile":  "displayProfile",
    }

    displayContact: () ->
      @view.onContactClicked()
      
    displayNews: () ->
      @view.onNewsClicked()
      
    displayProfile: () ->
      @view.onProfileClicked()
      
    displayActivities: () ->
      @view.onActivitiesClicked()
      
    registerView: (view) ->
      @view = view


