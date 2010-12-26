from newebe.platform.models import NewebeDocument
from couchdbkit.ext.django.schema import StringProperty, DateTimeProperty


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


    '''
    Methods to easily retrieve contacts from database.
    '''
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
    state = StringProperty()
    slug = StringProperty(required=True)
    requestDate = DateTimeProperty()


