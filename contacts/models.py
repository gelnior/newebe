import logging

from couchdbkit.schema import StringProperty, DateTimeProperty

from newebe.core.models import NewebeDocument

logger = logging.getLogger("newebe.contacts")


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
    

