from newebe.lib.date_util import getDbDateFromUrlDate
from newebe.core.handlers import NewebeAuthHandler
from newebe.lib import json_util

from newebe.activities.models import ActivityManager


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
            dateString = getDbDateFromUrlDate(startKey)
            activities = ActivityManager.get_all(dateString)
        else:
            activities = ActivityManager.get_all()

        self.returnJson(json_util.getJsonFromDocList(activities))

        
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
            dateString = getDbDateFromUrlDate(startKey)
            activities = ActivityManager.get_mine(dateString)
        else:
            activities = ActivityManager.get_mine()

        self.returnJson(json_util.getJsonFromDocList(activities))


class ActivityContentHandler(NewebeAuthHandler):
    def get(self):
        self.render("../templates/activities/activities_content.html")

class ActivityPageHandler(NewebeAuthHandler):
    def get(self):
        self.render("../templates/activities/activities.html")



