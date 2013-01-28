import logging
import datetime

from couchdbkit.schema import StringProperty

from newebe.apps.core.models import NewebeDocument
from newebe.apps.contacts.models import Contact

logger = logging.getLogger("newebe.profile")


# User document

class UserManager():
    '''
    Methods to easily retrieve owner of current Newebe from database.
    '''

    @staticmethod
    def getUser(startKey=None, skip=0):
        '''
        Returns first user found (normally user is unique).
        '''
        users = User.view("core/user")

        if users:
            return users.first()
        else:
            return None


class User(NewebeDocument):
    '''
    Users object used to handle owner data.
    '''

    name = StringProperty(required=True)
    description = StringProperty()
    url = StringProperty()
    key = StringProperty()
    password = StringProperty()
    picture_name = StringProperty()
    picture_content_type = StringProperty()

    def save(self):
        '''
        Before being saved, if no key is set, couchdb id is set as key for
        current user.
        '''
        if not self.key and "_id" in self.to_json():
            self.key = self.to_json()["_id"]

        if not self.date:
            self.date = datetime.datetime.now()

        super(NewebeDocument, self).save()

    def asContact(self):
        '''
        Return current user data as a Contact object.
        '''
        contact = Contact()
        contact.url = self.url
        contact.key = self.key
        contact.name = self.name
        contact.description = self.description
        contact.date = self.date

        return contact
