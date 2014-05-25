import logging
import markdown

from tornado.escape import json_decode

from newebe.apps.profile.models import UserManager
from newebe.apps.contacts.handlers import NewebeAuthHandler
from newebe.apps.notes.models import Note, NoteManager


logger = logging.getLogger("newebe.notes")


class NotesHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve lists of notes ordered by
    title.

    * GET: Retrieves all notes ordered by title.
    * POST: Create a new note.
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

        data = self.get_body_as_dict(expectedFields=["title", "content"])

        if data:
            note = Note(
                author=UserManager.getUser().name,
                title=data["title"],
                content=data["content"],
                isMine=True,
            )

            note.save()
            self.create_owner_creation_activity(note, "writes", "note")

            self.return_one_document(note, 201)
        else:
            self.return_failure("No data sent", 400)


class NotesByDateHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve lists of notes ordered by date.

    * GET: Retrieves all notes ordered by date.
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

    * GET: Retrieves given note.
    * PUT: Modifies given note.
    * DELETE: Deletes given note.
    '''

    def get(self, noteid):
        '''
        Returns all notes at JSON format.
        '''

        note = NoteManager.get_note(noteid)
        self.return_one_document_or_404(note, "No note exist for this id.")

    def put(self, noteid):
        '''
        Modifies note that has an ID equal to noteid with received data.
        '''

        logger.info("Note modificiation received.")

        note = NoteManager.get_note(noteid)
        data = self.get_body_as_dict(expectedFields=["title", "content"])

        if data and note:
            note.title = data["title"]
            note.content = data["content"]

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
            self.create_owner_deletion_activity(note, "deletes", "note")
            note.delete()
            self.return_success("Note deleted.")

        else:
            self.return_failure("No note to delete.", 404)
