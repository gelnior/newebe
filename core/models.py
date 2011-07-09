import datetime
from django.utils import simplejson as json

from couchdbkit import Server
from couchdbkit.schema import Document, StringProperty, \
                                         DateTimeProperty

from newebe.settings import COUCHDB_DB_NAME

server = Server()
db = server.get_or_create_db(COUCHDB_DB_NAME)

# Base document 

class NewebeDocument(Document):
    '''
    Base class for document used by newebe apps. Contains some utility methods.
    '''

    authorKey = StringProperty()
    date = DateTimeProperty(required=True, default=datetime.datetime.now())
    password = StringProperty()
     

    def toDict(self):
        '''
        Return a dict representation of the document (copy).
        '''

        docDict = self.__dict__["_doc"].copy()
        if "_rev" in docDict:
            del docDict["_rev"]
        return docDict


    def toJson(self):
        '''
        Return json representation of the document.
        '''

        docDict = self.toDict()
        return json.dumps(docDict)


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


    def save(self):
        '''
        Before being saved, if no key is set, couchdb id is set as key for
        current user.
        '''

        if not self.key and "_id" in self.to_json():
            self.key = self.to_json()["_id"]
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

        return contact

User.set_db(db)

# Contact document

# Contacts available states
STATE_PENDING = "pending"
STATE_WAIT_APPROVAL = "Wait for approval"
STATE_ERROR = "Error"
STATE_TRUSTED = "Trusted"


class ContactManager():
    '''
    Methods to easily retrieve contacts from database.
    '''


    @staticmethod
    def getContacts():
        '''
        Returns whole contact list.
        '''

        contacts = Contact.view("core/contact")
 
        return contacts 


    @staticmethod
    def getPendingContacts():
        '''
        Returns contacts of which state is equal to *pending* or *error*.
        '''

        contacts = Contact.view("core/pending")
 
        return contacts 


    @staticmethod
    def getRequestedContacts():
        '''
        Returns contacts of which state is equal to *requested*.
        '''

        contacts = Contact.view("core/requested")
 
        return contacts 


    @staticmethod
    def getTrustedContacts():
        '''
        Returns contacts of which state is equal to *trusted*.
        '''

        contacts = Contact.view("core/trusted")
 
        return contacts 


    @staticmethod
    def getTrustedContact(key):
        '''
        Returns trusted contact corresponding to *key*.
        '''

        contacts = Contact.view("core/trusted", key=key)
      
        contact = None
        if contacts:
            contact = contacts.first() 

        return contact


    @staticmethod
    def getContact(slug):
        '''
        Returns contact corresponding to slug.
        '''

        contacts = Contact.view("core/contact", key=slug)
      
        contact = None
        if contacts:
            contact = contacts.first() 

        return contact


class Contact(NewebeDocument):
    '''
    Contact describes another newebe with which you are going to share thing 
    (a "friend").
    '''
    
    name = StringProperty()
    key = StringProperty()
    url = StringProperty(required=True)
    state = StringProperty(required=True, default=STATE_PENDING)
    slug = StringProperty(required=True)
    requestDate = DateTimeProperty()
    description = StringProperty()
    

Contact.set_db(db)
