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


class UserTest(TestCase):
   
    def test_user_to_dict(self):
        user = User()
        user.name = "John Doe"
        
        expectedJson = '{"name": "Jhone Doe"}'
        self.assertEqual(expectedJson, user.toJson())


    def test_user_to_dict(self):
        user = User()
        user.name = "John Doe"
        
        userDict = user.toDict()
        self.assertEqual(user.name, userDict["name"])


    def testUserManager(self):
        user = User()
        user.name = "John Doe"

        userDb = UserManager.getUser()

        self.assertNone(userDb)

        user.save()

        userDb = UserManager.getUser()

        self.assertEquals(user.name, userDb.name)

        user.delete()


    def testGETUser(self):
        user = User()
        user.name = "John Doe"

        user.save()

        response = self.client.get('/news/user/')
        self.assertEqual(response.status_code, 200)

        users = json.loads(response.content)

        self.assertEquals(1, users["total_rows"])
        self.assertEquals(1, len(users["rows"]))

        userServer = users["rows"][0]
        self.assertEquals(user.name, userServer.name)

        user.delete()


    def testUserCreation(self):    
        user = User()
        user.name = "John Doe"

        response = self.client.post('/user/',
                                    user.toJson(), content_type="text/xml")
        self.assertEqual(response.status_code, 201)

        response = self.client.get('/news/user/')
        self.assertEqual(response.status_code, 200)

        users = json.loads(response.content)

        self.assertEquals(1, users["total_rows"])
        self.assertEquals(1, len(users["rows"]))

        userServer = users["rows"][0]
        self.assertEquals(user.name, userServer.name)

        response = self.client.post('/user/',
                                    user.toJson(), content_type="text/xml")
        self.assertEqual(response.status_code, 500)

        user = UserManager.getUser()
        user.delete()

    def testUserTemplates():
        response = self.client.get('/')
        self.assertEqual(response.template.name, 'platform/platform.html')
    
        response = self.client.get('/user/make/')
        self.assertEqual(response.template.name, 'platform/make_user.html')



