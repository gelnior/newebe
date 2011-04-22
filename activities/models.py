from couchdbkit.ext.django.schema import StringProperty, BooleanProperty, \
                                         ListProperty

from newebe.core.models import NewebeDocument
from newebe.activities import activity_settings



class ActivityManager():
    '''
    Furnishes static methods to retrieve easy activities from database.
    '''

    @staticmethod
    def get_mine(startKey=None, skip=0):
        '''
        '''
        if startKey:
            return Activity.view("activities/mine", 
                             startkey = startKey, 
                             descending = True, 
                             limit = activity_settings.LIMIT + 1, 
                             skip = 0)
        else:
            return Activity.view("activities/mine", 
                             descending=True, 
                             limit = activity_settings.LIMIT)


    @staticmethod
    def get_all(startKey=None, skip=0):
        
        if startKey:
            return Activity.view("activities/all", 
                             startkey = startKey, 
                             descending=True, 
                             limit=activity_settings.LIMIT+1, 
                             skip=0)
        else:
            return Activity.view("activities/all", 
                             descending=True, 
                             limit=activity_settings.LIMIT)






class Activity(NewebeDocument):
    '''
    Activity describes a user action or a contact action. This object is very 
    useful.

    With activities, the user log all his actions and all the actions from 
    his contacts. Moreover each user action stores when an error occured while
    transfering data corresponding to activity to a contact. 
    Data store in error list and activity are enought to make retry later to 
    send data to the contact of which request sending failed.
    '''

    author = StringProperty()
    # docId is used to retrieve the doc linked to the activity.
    docId = StringProperty(required=True)
    verb = StringProperty(required=True)
    method = StringProperty(required=True, default="POST")
    isMine = BooleanProperty(required=True, default=True)
    errors = ListProperty()


