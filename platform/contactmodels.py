from newebe.platform.models import NewebeDocument
from couchdbkit.ext.django.schema import StringProperty, DateTimeProperty


class ContactManager():
    '''
    Methods to easily retrieve contacts from database.
    '''
    @staticmethod
    def getContacts():
        '''
        Returns first user found (normally user is unique).
        '''
        contacts = Contact.view("platform/contact")
 
        return contacts 


class Contact(NewebeDocument):
    '''
    Contact describes another newebe with which you are going to share thing 
    (a "friend").
    '''
    
    name = StringProperty()
    key = StringProperty()
    url = StringProperty(required=True)
    state = StringProperty()
    requestDate = DateTimeProperty()


