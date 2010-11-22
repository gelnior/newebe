import datetime

from django.test import TestCase
from newebe.news.models import News

class ModelTest(TestCase):
     def test_news_to_json(self):
         """
         Tests that news is correctly converted at json format.
         """
         news = News()
         news.author = "me"
         news.content = "my content"
         news.date = datetime.datetime(2010, 10, 01, 11, 05, 12)

         expectedJson = '{"content": "my content", "date": "2010-10-01 '
         expectedJson += '11:05:12", "author": "me"}'
         self.assertEqual(expectedJson, news.toJson())

        


