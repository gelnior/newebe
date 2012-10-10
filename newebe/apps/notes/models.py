import datetime

from couchdbkit.schema import StringProperty, BooleanProperty, \
                                         DateTimeProperty

from newebe.apps.core.models import NewebeDocument
from newebe.apps.profile.models import UserManager

from newebe.lib.date_util import get_date_from_db_date, \
                                 get_db_date_from_date, \
                                 convert_utc_date_to_timezone


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

        return Note.view("notes/mine_sort_date", descending=True)

    @staticmethod
    def get_note(key):
        '''
        Returns note correspoding to key. If key does not exist or if note
        author is not the newebe owner, None is returned.
        '''

        notes = Note.view("notes/mine", key=key)

        if notes:
            return notes.first()

        return None


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

        if not self.authorKey:
            user = UserManager.getUser()
            self.authorKey = user.key
            self.author = user.name

        self.lastModified = datetime.datetime.utcnow()
        NewebeDocument.save(self)

    def toDict(self, localized=True):
        '''
        Return a dict representation of the document (copy).

        Removes _rev key and convert date field and last modified field
        to local timezone if *localized* is set to True.
        '''

        docDict = NewebeDocument.toDict(self, localized)

        if localized and "lastModified" in docDict:

            utc_date = get_date_from_db_date(docDict.get("lastModified"))
            date = convert_utc_date_to_timezone(utc_date)
            docDict["lastModified"] = get_db_date_from_date(date)

        return docDict
