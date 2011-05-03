import datetime
from django.utils import simplejson as json

from couchdbkit.ext.django.schema import Document, StringProperty, \
                                         DateTimeProperty

# Base document 

class NewebeDocument(Document):
    '''
    Base class for document used by newebe apps. Contains some utility methods.
    '''
    authorKey = StringProperty()
    date = DateTimeProperty(required=True, default=datetime.datetime.now())
     

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
        #if "_id" in docDict:
        #    del docDict["_id"]
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
    city = StringProperty()
    url = StringProperty()
    key = StringProperty()


    def save(self):
        super(NewebeDocument, self).save()
        if not self.key:
            self.key = self.get_id


    def toContact(self):
        contact = Contact()
        contact.url = self.url
        contact.key = self.key
        contact.name = self.name

        return contact



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
        Returns trusted contact corresponding to key
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

    

