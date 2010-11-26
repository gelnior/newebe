from django.test import TestCase

from newebe.lib import date_util

class DateUtilTest(TestCase):
     def testGetDbDateFromUrlDate(self):
         '''
         Tests if correct format is returned from function.
         '''
         expectedDate = "2010-10-01T11:05:12Z"
         dateToTest = "2010-10-01-11-05-12"
         self.assertEqual(expectedDate, 
                          date_util.getDbDateFromUrlDate(dateToTest))

class FileUtilTest(TestCase):
     def testStaticFileResponse(self):
         pass
         # These utils are no more used now.


class JsonUtilTest(TestCase):
    def testGetJsonFromList(self):    
         pass 
         # TODO when platform will have docs inside its model
