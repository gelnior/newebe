## Notes controller

# Notes controller Handle URL routes, it allows to access note browsing
# directly through the url.
class NotesController extends Backbone.Router

   routes:
    "notes/sort-date/":  "sortByDate"
    "notes/sort-title/":  "sortByTitle"
    "notes/sort-date/:slug":  "sortByDateAndDisplayNote"
    "notes/sort-title/:slug":  "sortByTitleAndDisplayNote"
   
      
   registerView: (view) ->
     @view = view

   sortByDate: ->
     alert "ok"
     @view.sortNotesByDate()
      
   sortByTitle: ->
     @view.sortNotesByTitle()

   sortByDateAndDisplayNote: (slug) ->
     @view.sortNotesByDate()

   sortByTitleAndDisplayNote: (slug) ->
     @view.sortNotesByTitle()

