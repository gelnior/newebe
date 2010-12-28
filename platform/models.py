from django.utils import simplejson as json

from couchdbkit.ext.django.schema import Document, StringProperty

class NewebeDocument(Document):
    '''
    Base class for document used by newebe apps. Contains some utility methods.
    '''
     
    def toDict(self):
        '''
        Return a dict representation of the document (copy).
        '''
        return self.__dict__["_doc"].copy()


    def toJson(self):
        '''
        Return json representation of the document.
        '''
        return json.dumps(self.toDict())


class UserManager():    
    '''
    Methods to easily retrieve owner of current Newebe from database.
    '''
    @staticmethod
    def getUser(startKey=None, skip=0):
        '''
        Returns first user found (normally user is unique).
        '''
        users = User.view("platform/user")

        if users:
            return users.first()
        else:
            return None


class User(NewebeDocument):
    '''
    Users object used to handle owner data.
    '''
    name = StringProperty(required=True)


