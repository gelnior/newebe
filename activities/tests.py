import unittest
import datetime

import sys, os
sys.path.append("../../")
os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'

from newebe.activities.models import Activity, ActivityManager
from newebe.activities import activity_settings



class testActivitiesModel(unittest.TestCase):
    '''
    Tests for activities model manager.
    '''

    def setUp(self):
        '''
        Delete all activities before tests start.
        '''

        activities = ActivityManager.get_all()
        while activities:
            for activity in activities:
                activity.delete()
            activities = ActivityManager.get_all()


    def test_get_all(self):
        """
        Tests that get_all returns LIMIT activities, and returns only
        requested activities when a key is set.
        """

        for i in range(activity_settings.LIMIT + 5):
            activity = Activity(
                author = "me",
                docId = "aaavvvbbbb%d" % i,
                verb = "write",
                method = "POST",
                isMine = False,
                errors = [],
                date = datetime.datetime(2010, 10, 01, 11, 05, 12)
            )
            activity.save()

        activities = ActivityManager.get_all()
        self.assertEqual(activity_settings.LIMIT, len(activities))

        activity = Activity(
            author = "me",
            docId = "aaavvvbbbb%d" % i,
            verb = "write",
            method = "POST",
            isMine = False,
            errors = [],
            date = datetime.datetime(2010, 9, 01, 11, 05, 12)
        )
        activity.save()

        activities = ActivityManager.get_all("2010-09-01T11:05:12Z")
        self.assertEqual(1, len(activities))


    def test_get_mine(self):        
        """
        Tests that get_mine returns LIMIT activities flagged isMine, and 
        returns only requested activities when a key is set.
        """

        for i in range(activity_settings.LIMIT + 5):
            activity = Activity(
                author = "me",
                docId = "aaavvvbbbb%d" % i,
                verb = "write",
                method = "POST",
                isMine = i < 10,
                errors = [],
                date = datetime.datetime(2010, 10, 01, 11, 05, 12)
            )
            activity.save()

        activities = ActivityManager.get_mine()
        self.assertEqual(10, len(activities))

        activity = Activity(
            author = "me",
            docId = "aaavvvbbbb%d" % i,
            verb = "write",
            method = "POST",
            isMine = False,
            errors = [],
            date = datetime.datetime(2010, 9, 01, 11, 05, 12)
        )
        activity.save()

        activity = Activity(
            author = "me",
            docId = "aaavvvbbbb%d" % i,
            verb = "write",
            method = "POST",
            isMine = True,
            errors = [],
            date = datetime.datetime(2010, 9, 01, 11, 05, 12)
        )
        activity.save()


        activities = ActivityManager.get_mine("2010-09-01T11:05:12Z")
        self.assertEqual(1, len(activities))



if __name__ == '__main__':
    import sys, os
    sys.path.append("../../")
    os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'

    unittest.main()        
