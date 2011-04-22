import unittest
import datetime

import sys, os
sys.path.append("../../")
os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'
from newebe.activities.models import Activity, ActivityManager
from newebe.activities import activity_settings

class testActivitiesModel(unittest.TestCase):

    def test_get_mine(self):
        """
        
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



if __name__ == '__main__':
    import sys, os
    sys.path.append("../../")
    os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'

    unittest.main()        
