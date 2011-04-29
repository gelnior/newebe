import datetime

from couchdbkit.ext.django.schema import StringProperty, BooleanProperty, \
                                         DateTimeProperty

from newebe.core.models import NewebeDocument



class NoteManager():
    '''
    Utility methods to retrieve note data.
    '''

    @staticmethod
    def getAll():
        '''
        Returns all note from newebe owner.
        '''
        return Note.view("notes/mine_sort_title")


    @staticmethod
    def getAllSortedByDate():
        '''
        Returns all note from newebe owner.
        '''
        return Note.view("notes/mine_sort_date")



    @staticmethod
    def getFirst(key):
        '''
        Returns note correspoding to key. If key does not exist or if note 
        author is not the newebe owner, None is returned.
        '''
        notes = Note.view("notes/mine", key=key)

        note = None
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

