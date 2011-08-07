import logging

from newebe.lib.date_util import get_db_date_from_url_date
from newebe.core.handlers import NewebeAuthHandler

from newebe.activities.models import ActivityManager


logger = logging.getLogger("newebe.activities")


class ActivityHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve lists of activities.
    GET : Retrieves last LIMIT activities published before a given date.
    '''

    def get(self, startKey=None):
        '''
        Return activities by pack of LIMIT at JSON format. If a start key 
        is given in URL (it means a date like 2010-10-05-12-30-48), 
        activities until this date are returned. Else latest activities are 
        returned. 

        Arguments:
            *startKey* The date until where activities should be returned.
        '''

        if startKey:
            dateString = get_db_date_from_url_date(startKey)
            activities = ActivityManager.get_all(dateString)
        else:
            activities = ActivityManager.get_all()

        self.return_documents(activities)

        
class MyActivityHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve lists of activities of
    newebe owner.
    GET : Retrieve last LIMIT activities published before a given date.
    '''

    def get(self, startKey=None):
        '''
        Return activities by pack of LIMIT at JSON format. If a start key 
        is given in URL (it means a date like 2010-10-05-12-30-48), 
        activities until this date are returned. Else latest activities are 
        returned. Only activities of newebe owner are returned.

        Arguments:
            *startKey* The date until where activities should be returned.
        '''

        if startKey:
            dateString = get_db_date_from_url_date(startKey)
            activities = ActivityManager.get_mine(dateString)
        else:
            activities = ActivityManager.get_mine()

        self.return_documents(activities)


# Template handlers

class ActivityContentHandler(NewebeAuthHandler):
    def get(self):
        self.render("../templates/activities/activities_content.html")

class ActivityPageHandler(NewebeAuthHandler):
    def get(self):
        self.render("../templates/activities/activities.html")



