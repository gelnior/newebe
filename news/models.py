import datetime

from django.utils import simplejson as json
from django.db import models

from couchdbkit.ext.django.schema import *

from newebe.lib import date_util
from newebe.news import news_settings


class NewsManager():
    '''
    Methods to easily retrive news from database.
    '''
    @staticmethod
    def getList(startKey=None, skip=0):
        '''
        Return last 10 (=NEWS_LIMIT in news_settings.py) micro posts descending
        from current user. If *startKey* is given, it retrieves micro posts from
        startKey. 

        Ex: If you need post from November, 2nd 2010, set *startKey*
        as 2010-11-02T23:59:00Z. First element is never included (because of
        pagination).

        Arguments:
          *startKey* The date from where data should be retrieved
        '''
        if startKey:
            return News.view("news/all", 
                             startkey = startKey, 
                             descending=True, 
                             limit=news_settings.NEWS_LIMIT+1, 
                             skip=0)
        else:
            return News.view("news/all", 
                             descending=True, 
                             limit=news_settings.NEWS_LIMIT)

    @staticmethod
    def getFirst(dateKey):
        '''
        Return first micro post written by current user from the list of micro
        posts corresponding to given date. Normally there should be only 
        one post for this date, so the list should have only one element.

        Date format is set in news_settings.DB_DATE_FORMAT.

        Arguments:
          *date* Date used to retrieve micro post.
        '''
        newss = News.view("news/all",
                          key=dateKey)

        if newss:        
            return newss.first()
        else:
            return None

class News(Document):
    '''
    News object used to handle news data.
    '''
    author = StringProperty()
    content = StringProperty(required=True)
    date = DateTimeProperty(default=datetime.datetime.now())
 
    def toDict(self):
         '''
         Return news as a dict object for easy json serializing.
         '''

         data = {}
         data['author'] = self.author
         data['content'] = self.content
         data['date']  = self.date.strftime(date_util.DISPLAY_DATETIME_FORMAT)

         return data

    def toJson(self):
        '''
        Return json representation of current object.
        '''
        return json.dumps(self.toDict())
