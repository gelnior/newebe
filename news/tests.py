import datetime

from django.test import TestCase
from django.utils import simplejson as json
from django.template.defaultfilters import slugify

from newebe.news.models import MicroPost, MicroPostManager
from newebe.core.models import Contact, ContactManager

from newebe.news.news_settings import NEWS_LIMIT
from newebe.lib.date_util import DB_DATETIME_FORMAT, URL_DATETIME_FORMAT
from newebe.core.models import STATE_TRUSTED



class ModelTest(TestCase):
    '''
    Test MicroPost model class.
    '''
  
    def setUp(self):
        microposts = MicroPostManager.getList()
        while microposts:
            for micropost in microposts:
                micropost.delete()
            microposts = MicroPostManager.getList()
        

    def test_news_to_dict(self):
        """
        Tests that news is correctly converted to dict.
        """
        micropost = ModelTest.getDefaultMicroPost()
        
        micropostDict = micropost.toDict()

        self.assertEqual("me", micropostDict["author"])
        self.assertEqual("my content", micropostDict["content"])
        self.assertEqual("2010-10-01T11:05:12Z", micropostDict["date"])
         

    def test_get_first(self):
        """
        Tests that first element since a given date is well returned.
        """
        micropost = ModelTest.getDefaultMicroPost()

        micropost.save()

        dateKey = micropost.date.strftime(DB_DATETIME_FORMAT)
        serverMicroPost = MicroPostManager.getFirst(dateKey)

        self.assertEqual(micropost.author, serverMicroPost.author)
        self.assertEqual(micropost.content, serverMicroPost.content)
        self.assertEqual(micropost.date, serverMicroPost.date)

        micropost.delete()


    def test_get_List(self):
        """
        Tests that NEWS_LIMIT elements are retrieved with 
        MicroPostManager.getList().

        Tests getList from key : tests that only news from this date are 
        returned.
        """

        for i in range(NEWS_LIMIT):
            micropost = MicroPost(
                author = "me",
                content = "content %s" % i,
                date = datetime.datetime(2010, 10, 01, 11, 05, 12)
            )
            micropost.save()

        microposts = MicroPostManager.getList()
        self.assertEqual(NEWS_LIMIT, len(microposts))

        micropost = MicroPost(
                author = "me",
                content = "content %s" % i,
                date = datetime.datetime(2010, 9, 01, 11, 05, 12)
        )
        micropost.save()

        microposts = MicroPostManager.getList("2010-09-01T11:05:12Z")
        self.assertEqual(1, len(microposts))


    @staticmethod
    def getDefaultMicroPost():
        '''
        Return a default microPost to facilitate testing.
        '''
        micropost = MicroPost()
        micropost.author = "me"
        micropost.content = "my content"
        micropost.date = datetime.datetime(2010, 10, 01, 11, 05, 12)

        return micropost


class ResourceTest(TestCase):
    '''
    Test micropost resources.
    '''

    def setUp(self):
        microposts = MicroPostManager.getList()
        while microposts:
            for micropost in microposts:
                micropost.delete()
            microposts = MicroPostManager.getList()

        contacts = ContactManager.getContacts()
        while contacts:
            for contact in contacts:
                contact.delete()
            contacts = ContactManager.getContacts()

    

    def test_micropost_wall_resource_get(self):
        """
        Tests that wall template is return on news URL.
        """
        response = self.client.get('/news/')
        self.assertEqual(response.template[0].name, 'news/news.html')

        response = self.client.get('/news/content/')
        self.assertEqual(response.template.name, 'news/news_content.html')


    def test_microposts_resource_get(self):
        """
        Tests that NEWS_LIMIT elements are retrieved with a GET request to 
        /news/microposts/
        """
        for i in range(NEWS_LIMIT):
            micropost = MicroPost(
                author = "me",
                content = "content %s" % i,
                date = datetime.datetime(2010, 10, 01, 11, 05, 12)
            )
            micropost.save()

        response = self.client.get('/news/microposts/')

        self.assertEqual(response.status_code, 200)
 
        microposts = json.loads(response.content)

        self.assertEquals(NEWS_LIMIT, microposts["total_rows"])
        self.assertEquals(NEWS_LIMIT, len(microposts["rows"]))


    def test_microposts_resource_get_key(self):
        """
        Ensure that right item is created when data are sent (POST to 
        /news/news-item/date-slug/ URL).
        """
        micropost = ModelTest.getDefaultMicroPost()
        micropost.save()

        url = '/news/microposts/%s/' % \
            micropost.date.strftime(URL_DATETIME_FORMAT)
        response = self.client.get(url)

        microposts = json.loads(response.content)
        micropostServer = microposts["rows"][0]
        serverDate = micropostServer["date"]
        self.assertEqual(micropost.date.strftime(DB_DATETIME_FORMAT),
                         serverDate)

        micropost.delete()


    def test_microposts_resource_post(self):
        """
        Test that new item is created when news data are sent (POST to 
        /news/news-item/date-slug/ URL.
        """
        micropost = MicroPost()
        micropost.content = "my content"

        currentDate = datetime.datetime.now()
        response = self.client.post('/news/microposts/', 
                                    micropost.toJson(), content_type="text/xml")     
        
        response = self.client.get('/news/microposts/%s/' 
                                   % currentDate.strftime(URL_DATETIME_FORMAT))
        microposts = json.loads(response.content)
        micropostServer = microposts["rows"][0]
        self.assertEqual(micropost.content, micropostServer["content"])

        self.client.delete('/news/microposts/%s/' 
                           % micropost.date.strftime(URL_DATETIME_FORMAT))


    def test_micropost_item_resource_delete(self):
        """
        Test that sending a DELETE request to /news/microposts/date-slug/ URL, 
        deletes the corresponding micropost.
        """
        micropost = ModelTest.getDefaultMicroPost()
        micropost.save()

        response = self.client.delete('/news/microposts/%s/' 
                            % micropost.date.strftime(URL_DATETIME_FORMAT))

        response = self.client.get('/news/microposts/%s/' 
                            % micropost.date.strftime(URL_DATETIME_FORMAT))
        microposts = json.loads(response.content)
        micropostsServer = microposts["rows"]

        self.assertEqual(0, len(micropostsServer))


    def test_contact_post_micro_post(self):
        '''
        Tests that a micropost from a trusted contact is well stored in the DB.
        '''
        

        contact = Contact(
            name = "John Doe",
            url = "http://localhost/1/",
            slug = slugify("http://localhost/1/"),
            state = STATE_TRUSTED
        )
        contact.save()
        contact.key = contact.get_id
        contact.save()

        micropost = ModelTest.getDefaultMicroPost()
        micropost.authorKey = contact.key
        micropost.author = contact.name

        self.client.post('/news/microposts/contacts/', 
                         micropost.toJson(), 
                         content_type="text/xml")
        
        microposts = MicroPostManager.getList()
        micropostServer = microposts.first()
        
        self.assertEqual(micropost.authorKey, micropostServer.authorKey)
        self.assertEqual(micropost.author, micropostServer.author)
    
        contact.delete()

    def test_contact_delete_micro_post(self):
        '''
        TODO
        Tests that a deletion request from a trusted contact is well 
        propageted to the DB.
        '''
        pass
