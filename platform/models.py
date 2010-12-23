from django.utils import simplejson as json

from couchdbkit.ext.django.schema import Document, StringProperty


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


class User(Document):
    '''
    Users object used to handle owner data.
    '''
    name = StringProperty(required=True)

    def toDict(self):
         '''
         Return user as a dict object.
         '''
         data = {}
         data['name'] = self.name

         return data

    def toJson(self):
        '''
        Return json representation of current object.
        '''
        return json.dumps(self.toDict())



