import logging
import markdown

from tornado.escape import json_decode

from newebe.profile.models import UserManager
from newebe.contacts.handlers import NewebeAuthHandler
from newebe.activities.models import Activity
from newebe.notes.models import Note, NoteManager


logger = logging.getLogger("newebe.notes")


class NotesHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve lists of notes ordered by title.
    GET: Retrieves all notes ordered by title.
    POST: Create a new note.
    '''


    def get(self):
        '''
        Returns all notes ordered by title at JSON format.
        '''

        notes = NoteManager.get_all()
        self.return_documents(notes)


    def post(self):
        '''
        Creates a new note from received data.
        '''

        logger.info("Note creation received.")

        data = self.request.body

        if data:
            jsonNote = json_decode(data)
            note = Note(
                author = UserManager.getUser().name,
                title = jsonNote["title"],
                content = jsonNote["content"],
                isMine = True,
            )
            note.save()
            
            self.create_write_activity(note)
            self.return_json(note.toJson(), 201)
        else:
            self.return_failure("No data sent", 400)


    def create_write_activity(self, note):
        '''
        Creates and save a new creation activity for current user.
        '''
            
        activity = Activity(
            authorKey = UserManager.getUser().key,
            author = note.author,
            verb = "writes",
            docType = "note",
            docId = note._id,
            isMine = True,
            date = note.lastModified
        )
        activity.save()


class NotesByDateHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve lists of notes ordered by date.
    GET: Retrieves all notes ordered by date.
    '''


    def get(self):
        '''
        Returns all notes ordered by date at JSON format.
        '''

        notes = NoteManager.get_all_sorted_by_date()
        self.return_documents(notes)


class NoteHandler(NewebeAuthHandler):
    '''
    Handler used to work on a given note.
    GET: Retrieves given note.
    PUT: Modifies given note.
    DELETE: Deletes given note.
    '''


    def get(self, noteid):
        '''
        Returns all notes at JSON format.
        '''

        note = NoteManager.get_note(noteid)

        if note:
            self.return_document(note)

        else:
            self.return_failure("No note exist for this id.", 404)


    def put(self, noteid):
        '''
        Modifies note that has an ID equal to noteid with received data.
        '''

        logger.info("Note modificiation received.")

        note = NoteManager.get_note(noteid)
        data = self.request.body
        
        if data and note:
            jsonNote = json_decode(data)
            note.title = jsonNote["title"]
            note.content = jsonNote["content"]
            
            note.save()

            self.return_success("Note successfully modified.")

        else:
            self.return_failure("No note exist for this id.", 404)


    def delete(self, noteid):
        '''
        Deletes note that has an ID equal to noteid with received data.
        '''

        logger.info("Note deletion received.")

        note = NoteManager.get_note(noteid)

        if note:
            self.create_delete_activity(note)
            note.delete()
            self.return_success("Note deleted.")

        else:
            self.return_failure("No note to delete.", 404)


    def create_delete_activity(self, note):
        '''
        Creates and save a new delete activity for current user.
        '''
            
        activity = Activity(
            authorKey = UserManager.getUser().key,
            author = note.author,
            verb = "deletes",
            docType = "note",
            docId = note._id,
            isMine = True,
            method = "DELETE"        
        )
        activity.save()


class NoteTHandler(NewebeAuthHandler):
    '''
    This handler allows to retrieve note at HTML format.
    * GET: Return for given id the HTML representation of corresponding note.
    '''


    def get(self, noteId):
        '''
        Returns for given id the HTML representation of corresponding 
        note.
        '''

        note = NoteManager.get_note(noteId)
        if note:

            if note.content:
                 note.content = markdown.markdown(note.content)

            self.render("templates/note.html", note=note)
        else:
            self.return_failure("Note not found.", 404)




# Template handlers

class NotesContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/notes_content.html")

class NotesPageTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/notes.html")


