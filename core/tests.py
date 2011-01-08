from django.test import TestCase
from django.utils import simplejson as json

from newebe.core.models import User, UserManager
from newebe.core.models import Contact, ContactManager
from newebe.core.models import STATE_WAIT_APPROVAL, STATE_TRUSTED
from newebe.lib import date_util, json_util

from django.template.defaultfilters import slugify


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
        '''
        Test that generated json corresponds really to a json list.
        '''
        user1 = User()
        user1.name = "John Doe"
        user2 = User()
        user2.name = "Jack Doe"

        users = [user1, user2]

        expectedJson = '{"rows": [' + user1.toJson() + ', ' + user2.toJson()
        expectedJson += '], "total_rows": 2}'
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
        user.key = "key"
        user.authorKey = "authorKey"
        user.url = "url"
        user.city = "paris"
        
        expectedJson = '{"doc_type": "User", "name": "John Doe", "key": "key",'
        expectedJson += ' "authorKey": "authorKey", "url": "url", "city": '
        expectedJson += '"paris"}'
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
        to /user/.
        '''
        user = User()
        user.name = "John Doe"

        user.save()

        response = self.client.get('/user/')
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
        to /user/ URI. 
        Checks that two users cannot be created via POST request.
        """
        user = User()
        user.name = "John Doe"

        response = self.client.post('/user/',
                                    user.toJson(), content_type="text/xml")
        self.assertEqual(response.status_code, 201)

        response = self.client.get('/user/')
        self.assertEqual(response.status_code, 200)

        users = json.loads(response.content)
        self.assertEquals(1, users["total_rows"])
        self.assertEquals(1, len(users["rows"]))
        userServer = users["rows"][0]
        self.assertEquals(user.name, userServer["name"])

        response = self.client.post('/user/',
                                    user.toJson(), content_type="text/xml")
        self.assertEqual(response.status_code, 500)


    def testUserModification(self):    
        """
        Checks that user is rightly modified when a PUT request is performed
        to /user/ URI.
        """
        user = User()
        user.name = "John Doe"
        user.save()

        user.name = "John Doe 2"
        response = self.client.put('/user/',
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
        response = self.client.get('/profile/')
        self.assertEqual(response.template[0].name, 'core/register.html')

        user = User()
        user.name = "John Doe"
        user.save()
        response = self.client.get('/profile/')
        self.assertEqual(response.template[0].name, "core/profile/profile.html")
        
        response = self.client.get('/profile/content/')
        self.assertEqual(response.template.name,  
                         "core/profile/profile_content.html")

        user.delete()


class ContactTest(TestCase):
    '''
    Test contact model
    '''

    def setUp(self):
        '''
        Reset contact model by deleting every contacts.
        '''
        contacts = ContactManager.getContacts()
        while contacts:
            for contact in contacts:
                contact.delete()
            contacts = ContactManager.getContacts()

    def testGetContact(self):
        '''
        TODO
        Tests getTrustedContact(key) and getContact(key) methods.
        '''
        pass

    def testGetList(self):
        '''
        Test that contact manager returns all contact lists correctly.
        '''
        contacts = ContactManager.getContacts()
        self.assertEqual(0, len(contacts))

        contact = Contact()
        contact.url = "http://localhost/1/"
        contact.slug = slugify(contact.url)
        contact.state = "pending"
        contact.save()
        contact2 = Contact()
        contact2.url = "http://localhost/2/"
        contact2.slug = slugify(contact.url)
        contact2.state = STATE_TRUSTED
        contact2.save()
        contact3 = Contact()
        contact3.url = "http://localhost/3/"
        contact3.slug = slugify(contact.url)
        contact3.state = STATE_WAIT_APPROVAL
        contact3.save()

        contacts = ContactManager.getContacts()
        self.assertEquals(3, len(contacts))

        contacts = ContactManager.getTrustedContacts()
        self.assertEquals(1, len(contacts))

        contacts = ContactManager.getPendingContacts()
        self.assertEquals(1, len(contacts))

        contacts = ContactManager.getRequestedContacts()
        self.assertEquals(1, len(contacts))


class ContactResourceTest(TestCase):
    '''
    Test contact resource
    '''

    def setUp(self):
        '''
        Reset contact model by deleting every contacts.
        '''
        contacts = ContactManager.getContacts()
        for contact in contacts:
            contact.delete()

        self.user = User(name = "Jhon Doe")
        self.user.save()


    def tearDown(self):
        self.user.delete()


    def test_contact_template_resource_get(self):
        """
        Tests that contact template is returned on /contacts URL.
        """

        response = self.client.get('/contact/')
        self.assertEqual(response.template[0].name, 'core/contact/contact.html')

        response = self.client.get('/contact/content/')
        self.assertEqual(response.template.name, 
                         'core/contact/contact_content.html')


    def test_contact_resource_get(self):
        """
        Tests that all contacts are retrieved with a GET request to 
        /platform/contacts/
        """
        contact = Contact()
        contact.url = "http://localhost/1/"
        contact.slug = slugify(contact.url)
        contact.state = "pending"
        contact.save()
        contact2 = Contact()
        contact2.url = "http://localhost/2/"
        contact2.slug = slugify(contact.url)
        contact2.state = "pending"
        contact2.save()

        response = self.client.get('/contacts/')

        self.assertEqual(response.status_code, 200)

        newss = json.loads(response.content)

        self.assertEquals(2, newss["total_rows"])
        self.assertEquals(2, len(newss["rows"]))


    def testPostContact(self):
        '''
        Test that contact created via a POST request is correctly save to 
        database.
        '''
        contact = Contact()
        contact.url = "http://localhost/1/"

        response = self.client.post('/contacts/',
                                    contact.toJson(), content_type="text/xml")

        self.assertEqual(201, response.status_code)
        contacts = ContactManager.getContacts().all()
        contactServer = contacts[0]
        self.assertEqual(contact.url, contactServer.url)
 

    def testDeleteContact(self):
        '''
        Test that DELETE request to a contact URI, removes this contact from DB
        '''
        contact = Contact()
        contact.name = "John Doe"
        contact.url = "http://localhost/1/"        
        contact.slug = slugify(contact.url)
        contact.save()

        response = self.client.delete('/contacts/%s/' % contact.slug)

        self.assertEqual(200, response.status_code)
        jsonResponse = json.loads(response.content)
        self.assertEquals("Contact has been deleted.", jsonResponse["success"])
        self.assertIsNone(ContactManager.getContact(contact.slug))


    def testPushContact(self):
        '''
        Tests that when a contact ask for connection by posting its identity
        to /contacts/request/ URI, it is stored in the 
        DB with wait approval as status.
        '''
        
        contact = Contact()
        contact.name = "John Doe"
        contact.url = "http://localhost/1/"        
        contact.slug = slugify(contact.url)

        response = self.client.post('/contacts/request/',
                                    contact.toJson(), content_type="text/xml")

        self.assertEqual(200, response.status_code)
        jsonResponse = json.loads(response.content)
        self.assertEquals("Request received.", jsonResponse["success"])
        
        contacts = ContactManager.getContacts().all()
        contactServer = contacts[0]
        self.assertEqual(contact.url, contactServer.url)
        self.assertEqual(STATE_WAIT_APPROVAL, contactServer.state)
 

    def testAcknowledge(self): 
        '''
        Tests that confirming a contact sets its status to 
        '''

        contact = Contact()
        contact.name = "John Doe"
        contact.url = "http://localhost/1/"
        contact.slug = slugify(contact.url)
        contact.save()
        
        contact.key =  "my-key"

        response = self.client.post('/contacts/confirm/',
                                    contact.toJson(), content_type="text/xml")
        self.assertEqual(200, response.status_code)
        jsonResponse = json.loads(response.content)
        self.assertEquals("Contact trusted.", jsonResponse["success"])

        contacts = ContactManager.getContacts().all()
        contactServer = contacts[0]
        self.assertEqual(contact.url, contactServer.url)
        self.assertEqual(STATE_TRUSTED, contactServer.state)
        self.assertEqual(contact.key, contactServer.key)




