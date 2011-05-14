import unittest
import datetime

import sys, os
sys.path.append("../../")
os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'

import tornado
from django.utils import simplejson as json
from tornado.testing import AsyncHTTPTestCase 
from tornado.web import Application, url
from tornado.httpclient import AsyncHTTPClient
from tornado.httpserver import HTTPServer

from newebe.activities.models import Activity, ActivityManager
from newebe.activities import activity_settings

from newebe.activities.handlers import ActivityHandler, MyActivityHandler


class ActivityHandlersTestCase(AsyncHTTPTestCase):


    def get_app(self): 
        '''
        Set routers.
        '''

        return Application([
            url('/activities/all/', ActivityHandler),
            url('/activities/all/([0-9\-]+)/', ActivityHandler),
            url('/activities/mine/', MyActivityHandler),
            url('/activities/mine/([0-9\-]+)/', MyActivityHandler),
        ], gzip=True)


    def setUp(self):
        '''
        Delete all activities on setup.
        '''
        super(ActivityHandlersTestCase(), self).setUp()  

        activities = ActivityManager.get_all()
        while activities:
            for activity in activities:
                activity.delete()
            activities = ActivityManager.get_all()


    def test_all(self):
        """
        Tests that all service returns LIMIT activities, and returns only
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

        response = self.fetch("/activities/all/")
        self.assertEqual(response.code, 200)
        self.assertEqual(response.headers["Content-Type"], "application/json")
 
        activities = json.loads(response.body)

        self.assertEquals(activity_settings.LIMIT, activities["total_rows"])
        self.assertEquals(activity_settings.LIMIT, len(activities["rows"]))


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

        response = self.fetch("/activities/all/2010-09-02-11-05-12/")
        self.assertEqual(response.code, 200)
        self.assertEqual(response.headers["Content-Type"], "application/json")
 
        activities = json.loads(response.body)

        self.assertEquals(1, activities["total_rows"])
        self.assertEquals(1, len(activities["rows"]))


    def test_mine(self):     
        """
        Tests that mine service returns LIMIT activities flagged isMine, and 
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

        response = self.fetch("/activities/mine")
        self.assertEqual(response.code, 200)
        self.assertEqual(response.headers["Content-Type"], "application/json")
 
        activities = json.loads(response.body)

        self.assertEquals(10, activities["total_rows"])
        self.assertEquals(10, len(activities["rows"]))

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

        response = self.fetch("/activities/mine/2010-09-02-11-05-12/")
        self.assertEqual(response.code, 200)
        self.assertEqual(response.headers["Content-Type"], "application/json")
 
        activities = json.loads(response.body)

        self.assertEquals(1, activities["total_rows"])
        self.assertEquals(1, len(activities["rows"]))


if __name__ == '__main__':
    import sys, os
    sys.path.append("../../")
    os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'

    unittest.main()    
