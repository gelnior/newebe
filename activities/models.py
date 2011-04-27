from couchdbkit.ext.django.schema import StringProperty, BooleanProperty, \
                                         ListProperty

from newebe.core.models import NewebeDocument
from newebe.activities import activity_settings



class ActivityManager():
    '''
    Furnishes static methods to retrieve easily activities from database.
    '''

    @staticmethod
    def get_mine(startKey=None, skip=0):
        '''
        Return last 30 activities of newebe owner. If *startKey* (date) 
        is given, last 30 activities until *startKey* will be returned.
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
        '''
        Return last 30 activities of newebe owner and of his contacts. If
        *startKey* (date) is given, last 30 activities until *startKey* 
        will be returned.
        '''
        
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
    Activity describes a user action or a contact action.
    With activities, the user log alls his actions and all the actions from 
    his contacts. Moreover inside activities are stored error which occured 
    while transfering document corresponding to activity to a contact. It
    handles a list of error (one error for each contact is stored). This
    list is used to makre retries later.
    '''

    author = StringProperty()
    # docId is used to retrieve the doc linked to the activity.
    docId = StringProperty(required=True)
    verb = StringProperty(required=True)
    method = StringProperty(required=True, default="POST")
    isMine = BooleanProperty(required=True, default=True)
    errors = ListProperty()


