from couchdbkit.schema import StringProperty, BooleanProperty, \
                                         ListProperty

from newebe.apps.core.models import NewebeDocument, DocumentManager
from newebe.apps.activities import activity_settings


class ActivityManager:
    '''
    Furnishes static methods to retrieve easily activities from database.
    '''

    @staticmethod
    def get_activity(key):
        '''
        Returns activity of which key is equal to *key*.
        '''

        activities = Activity.view("activities/full", key=key)

        if activities:
            return activities.first()
        else:
            return None

    @staticmethod
    def get_mine(startKey=None, tag=None):
        '''
        Return last 30 activities of newebe owner. If *startKey* (date)
        is given, last 30 activities until *startKey* will be returned.
        '''

        return DocumentManager.get_documents(Activity, "activities/mine",
                startKey=startKey, limit=activity_settings.LIMIT + 1)

    @staticmethod
    def get_all(startKey=None, tag=None):
        '''
        Return last 30 activities of newebe owner and of his contacts. If
        *startKey* (date) is given, last 30 activities until *startKey*
        will be returned.
        '''

        return DocumentManager.get_documents(Activity, "activities/all",
                startKey=startKey, limit=activity_settings.LIMIT + 1)


class Activity(NewebeDocument):
    '''
    Activity describes a user action or a contact action.
    With activities, newebe log alls actions from owner and his contacts.
    Moreover inside each activity are stored error which occured
    while transfering document corresponding to this activity. It
    handles a list of error: one error for each contact where error occurs.
    This list is used to make retry sending data later to concerned
    contact.
    '''

    author = StringProperty()
    verb = StringProperty(required=True)
    docType = StringProperty(required=True)
    # docId is used to retrieve the doc linked to the activity.
    docId = StringProperty(required=True)
    method = StringProperty(required=True, default="POST")
    isMine = BooleanProperty(required=True, default=True)
    errors = ListProperty()

    def add_error(self, contact, extra=None):
        '''
        And to the error list an error based on *contact* data. Extra
        information can be added to error object (sometimes linked object
        does not exist anymore so some extra data are date are needed).
        '''

        if not self.errors:
            self.errors = []

        activityError = {
            "contactKey": contact.key,
            "contactName": contact.name,
            "contactUrl": contact.url
        }

        if extra:
            activityError["extra"] = extra

        self.errors.append(activityError)
