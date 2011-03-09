from couchdbkit.ext.django.schema import StringProperty, BooleanProperty, \
                                         ListProperty

from newebe.core.models import NewebeDocument

class Activity(NewebeDocument):
    '''
    TODO
    '''
    author = StringProperty()
    docId = StringProperty(required=True)
    verb = StringProperty(required=True)
    method = StringProperty(required=True, default="POST")
    isMine = BooleanProperty(required=True, default=True)
    errors = ListProperty()

class ActivityError(NewebeDocument):
    '''
    TODO
    '''
    contactKey = StringProperty(required=True)
    contactName = StringProperty(required=True)
    message = StringProperty()
