from django.test import TestCase
from django.utils import simplejson as json

from newebe.platform.models import User, UserManager
from newebe.lib import date_util
from newebe.lib import json_util


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
        user1 = User()
        user1.name = "John Doe"
        user2 = User()
        user2.name = "Jack Doe"

        users = [user1, user2]

        expectedJson = '{"rows": [{"name": "John Doe"}, {"name": "Jack Doe"}],'
        expectedJson += ' "total_rows": 2}'
        self.assertEqual(expectedJson, json_util.getJsonFromDocList(users))

        

class UserTest(TestCase):

    def setUp(self):
        user = UserManager.getUser()
        while user:
            user.delete()
            user = UserManager.getUser()
        

    def test_user_to_json(self):
        '''
        Checks that user JSON conversion functions works fine.
        '''
        user = User()
        user.name = "John Doe"
        
        expectedJson = '{"name": "John Doe"}'
        self.assertEqual(expectedJson, user.toJson())


    def test_user_to_dict(self):
        '''
        Checks that user dictionnary conversion functions works fine.
        '''
        user = User()
        user.name = "John Doe"
        
        userDict = user.toDict()
        self.assertEqual(user.name, userDict["name"])


    def testUserManager(self):
        '''
        Checks that user manager retrieve current user (newebe owner) well.
        '''
        user = User()
        user.name = "John Doe"

        userDb = UserManager.getUser()
        self.assertIsNone(userDb)
        
        user.save()
        userDb = UserManager.getUser()
        self.assertEquals(user.name, userDb.name)

        user.delete()


    def testGETUser(self):
        '''
        Checks that user is rightly retrieved when a GET request is performed
        to /platform/user/.
        '''
        user = User()
        user.name = "John Doe"

        user.save()

        response = self.client.get('/platform/user/')
        self.assertEqual(response.status_code, 200)

        users = json.loads(response.content)

        self.assertEquals(1, users["total_rows"])
        self.assertEquals(1, len(users["rows"]))

        userServer = users["rows"][0]
        self.assertEquals(user.name, userServer["name"])

        user.delete()


    def testUserCreation(self):    
        """
        Checks that user is rightly created when a POST request is performed
        to /platform/user/ URI. 
        Checks that two users cannot be created via POST request.
        """
        user = User()
        user.name = "John Doe"

        response = self.client.post('/platform/user/',
                                    user.toJson(), content_type="text/xml")
        self.assertEqual(response.status_code, 201)

        response = self.client.get('/platform/user/')
        self.assertEqual(response.status_code, 200)

        users = json.loads(response.content)
        self.assertEquals(1, users["total_rows"])
        self.assertEquals(1, len(users["rows"]))
        userServer = users["rows"][0]
        self.assertEquals(user.name, userServer["name"])

        response = self.client.post('/platform/user/',
                                    user.toJson(), content_type="text/xml")
        self.assertEqual(response.status_code, 500)


    def testUserModification(self):    
        """
        Checks that user is rightly modified when a PUT request is performed
        to /platform/user/ URI.
        """
        user = User()
        user.name = "John Doe"
        user.save()

        user.name = "John Doe 2"
        response = self.client.put('/platform/user/',
                                    user.toJson(), content_type="text/xml")
        self.assertEqual(response.status_code, 200)

        userServer = UserManager.getUser()        
        self.assertEqual(user.name, userServer.name) 

        user.delete()


    def testUserTemplates(self):
        """
        Check that register template is returned when no user exists when
        a GET request is sent to a template URI.
        Check that right templates are returned for platform applications 
        template URIs.
        """
        response = self.client.get('/platform/profile/')
        self.assertEqual(response.template[0].name, 'platform/register.html')

        user = User()
        user.name = "John Doe"
        user.save()
        response = self.client.get('/platform/profile/')
        self.assertEqual(response.template[0].name,  "platform/profile.html")
        
        response = self.client.get('/platform/profile/content/')
        self.assertEqual(response.template.name,  
                         "platform/profile_content.html")

        user.delete()

