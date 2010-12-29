from newebe.platform.models import NewebeDocument
from couchdbkit.ext.django.schema import StringProperty, DateTimeProperty

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
        contacts = Contact.view("platform/contact")
 
        return contacts 


    @staticmethod
    def getPendingContacts():
        '''
        Returns contacts of which state is equal to *pending* or *error*.
        '''
        contacts = Contact.view("platform/pending")
 
        return contacts 


    @staticmethod
    def getRequestedContacts():
        '''
        Returns contacts of which state is equal to *requested*.
        '''
        contacts = Contact.view("platform/requested")
 
        return contacts 

    @staticmethod
    def getTrustedContacts():
        '''
        Returns contacts of which state is equal to *trusted*.
        '''
        contacts = Contact.view("platform/trusted")
 
        return contacts 

    @staticmethod
    def getTrustedContact(key):
        '''
        Returns trusted contact corresponding to key
        '''
        contacts = Contact.view("platform/trusted", key=key)
      
        contact = None
        if contacts:
            contact = contacts.first() 

        return contact



    @staticmethod
    def getContact(slug):
        '''
        Returns contact corresponding to slug.
        '''
        contacts = Contact.view("platform/contact", key=slug)
      
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

    

