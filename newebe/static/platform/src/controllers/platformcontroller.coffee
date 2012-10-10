## Platform Controller

# Platform controller Handle URL routes, it allows to display applications
# set in the URL.
class PlatformController extends Backbone.Router

    routes: {
      "contact":  "displayContact",
      "news":  "displayNews",
      "activities":  "displayActivities",
      "profile":  "displayProfile",
      "notes":  "displayNotes",
      "pictures":  "displayPictures",
    }

    displayContact: () ->
      @view.onContactClicked()
      
    displayNews: () ->
      @view.onNewsClicked()
      
    displayProfile: () ->
      @view.onProfileClicked()
      
    displayActivities: () ->
      @view.onActivitiesClicked()
      
    displayNotes: () ->
      @view.onNotesClicked()

    displayPictures: () ->
      @view.onPicturesClicked()

    registerView: (view) ->
      @view = view


