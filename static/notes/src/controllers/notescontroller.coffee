## Notes controller

# Notes controller Handle URL routes, it allows to access note browsing
# directly through the url.
class NotesController extends Backbone.Router

   routes:
    "sort-date/":  "sortByDate"
    "sort-title/":  "sortByTitle"
    "sort-date/:slug":  "sortByDateAndDisplayNote"
    "sort-title/:slug":  "sortByTitleAndDisplayNote"
   
      
   registerView: (view) ->
     @view = view

   sortByDate: ->
     @view.sortNotesByDate()
      
   sortByTitle: ->
     @view.sortNotesByTitle()

   sortByDateAndDisplayNote: (slug) ->
     @view.sortNotesByDate()

   sortByTitleAndDisplayNote: (slug) ->
     @view.sortNotesByTitle()

