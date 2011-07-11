import datetime

from couchdbkit.schema import StringProperty, BooleanProperty, \
                                         DateTimeProperty

from newebe.core.models import NewebeDocument


class NoteManager():
    '''
    Utility methods to retrieve note data.
    '''

    @staticmethod
    def get_all():
        '''
        Returns all notes from newebe owner, sorted by title.
        '''

        return Note.view("notes/mine_sort_title")


    @staticmethod
    def get_all_sorted_by_date():
        '''
        Returns all notes from newebe owner, sorted by date.
        '''

        return Note.view("notes/mine_sort_date")


    @staticmethod
    def get_note(key):
        '''
        Returns note correspoding to key. If key does not exist or if note 
        author is not the newebe owner, None is returned.
        '''

        notes = Note.view("notes/mine", key=key)

        if notes:        
            note = notes.first()

        return note


class Note(NewebeDocument):
    '''
    Note document for note storage.
    '''

    author = StringProperty()
    title = StringProperty(required=True)    
    content = StringProperty(required=False)
    lastModified = DateTimeProperty(required=True, 
                                    default=datetime.datetime.now())
    isMine = BooleanProperty(required=True, default=True)


    def save(self):
        '''
        When document is saved, the last modified field is updated to 
        make sure it is always correct. 
        '''

        self.lastModified = datetime.datetime.now()
        NewebeDocument.save(self)


#Note.set_db(dbhandler.get_db())

