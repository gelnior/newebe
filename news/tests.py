import datetime

from django.test import TestCase
from django.utils import simplejson as json

from newebe.news.models import News, NewsManager
from newebe.news.news_settings import NEWS_LIMIT
from newebe.lib.date_util import *

class ModelTest(TestCase):
    '''
    Test News model class.
    '''
   
    def test_news_to_json(self):
         """
         Tests that news is correctly converted to json format.
         """
         news = ModelTest.getDefaultNews()

         expectedJson = '{"content": "my content", "date": "2010-10-01 '
         expectedJson += '11:05:12", "author": "me"}'
         self.assertEqual(expectedJson, news.toJson())

        
    def test_news_to_dict(self):
         """
         Tests that news is correctly converted to dict.
         """
         news = ModelTest.getDefaultNews()
         
         newsDict = news.toDict()

         self.assertEqual("me", newsDict["author"])
         self.assertEqual("my content", newsDict["content"])
         self.assertEqual("2010-10-01 11:05:12",newsDict["date"])
         

    def test_get_first(self):
         """
         Test that first element since a given date is well returned.
         """
         news = ModelTest.getDefaultNews()

         news.save()

         dateKey = news.date.strftime(DB_DATETIME_FORMAT)
         serverNews = NewsManager.getFirst(dateKey)

         self.assertEqual(news.author, serverNews.author)
         self.assertEqual(news.content, serverNews.content)
         self.assertEqual(news.date, serverNews.date)

         news.delete()


    def test_get_List(self):
         """
         Tests that NEWS_LIMIT elements are retrieved with 
         NewsManager.getList().
         """
         newss = NewsManager.getList()

         self.assertEqual(NEWS_LIMIT, len(newss))


    @staticmethod
    def getDefaultNews():
        '''
        Return a default news to facilitate testing.
        '''
        news = News()
        news.author = "me"
        news.content = "my content"
        news.date = datetime.datetime(2010, 10, 01, 11, 05, 12)

        return news


class ResourceTest(TestCase):
    '''
    Test news resources.
    '''

    def test_news_wall_resource_get(self):
        """
        Tests that wall template is return on news/wall URL.
        """
        response = self.client.get('/news/wall/')
        self.assertEqual(response.template[0].name, 'news/wall.html')


    def test_news_item_resource_get(self):
        """
        Tests that NEWS_LIMIT elements are retrieved with a GET request to 
        /news/news-item/
        """
        response = self.client.get('/news/news-item/')

        self.assertEqual(response.status_code, 200)
 
        newss = json.loads(response.content)

        self.assertEquals(NEWS_LIMIT, newss["total_rows"])
        self.assertEquals(NEWS_LIMIT, len(newss["rows"]))


    def test_news_item_resource_get_key(self):
        """
        Ensure that right item is created when data are sent (POST to 
        /news/news-item/date-slug/ URL).
        """
        news = ModelTest.getDefaultNews()
        news.save()

        url = '/news/news-item/%s/' % news.date.strftime(URL_DATETIME_FORMAT)
        response = self.client.get(url)
        newss = json.loads(response.content)
        newsServer = newss["rows"][0]
        newsDate = newsServer["date"]
        self.assertEqual(news.date.strftime(DISPLAY_DATETIME_FORMAT), newsDate)

        news.delete()


    def test_news_item_resource_post(self):
        """
        Test that new item is created when news data are sent (POST to 
        /news/news-item/date-slug/ URL.
        """
        news = News()
        news.content = "my content"

        currentDate = datetime.datetime.now()
        response = self.client.post('/news/news-item/', 
                                    news.toJson(), content_type="text/xml")     
        
        response = self.client.get('/news/news-item/%s/' 
                                   % currentDate.strftime(URL_DATETIME_FORMAT))
        newss = json.loads(response.content)
        newsServer = newss["rows"][0]
        self.assertEqual(news.content, newsServer["content"])

        self.client.delete('/news/news-item/%s/' 
                           % news.date.strftime(URL_DATETIME_FORMAT))


    def test_news_item_resource_delete(self):
        """
        Test that sending a DELETE request to /news/news-item/date-slug/ URL, 
        deletes the corresponding news.
        """
        news = ModelTest.getDefaultNews()
        news.save()

        response = self.client.delete('/news/news-item/%s/' 
                                      % news.date.strftime(URL_DATETIME_FORMAT))

        response = self.client.get('/news/news-item/%s/' 
                                   % news.date.strftime(URL_DATETIME_FORMAT))
        newss = json.loads(response.content)
        newssServer = newss["rows"]

        self.assertEqual(0, len(newssServer))

