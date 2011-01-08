import datetime

from couchdbkit.ext.django.schema import StringProperty,  DateTimeProperty

from newebe.core.models import NewebeDocument
from newebe.news import news_settings


class MicroPostManager():
    '''
    Furnishes static methods for easy news database retreiving.
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
            return MicroPost.view("news/all", 
                             startkey = startKey, 
                             descending=True, 
                             limit=news_settings.NEWS_LIMIT+1, 
                             skip=0)
        else:
            return MicroPost.view("news/all", 
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
        print dateKey
        microposts = MicroPost.view("news/all",
                                    key=dateKey)

        micropost = None
        if microposts:        
            micropost = microposts.first()

        return micropost


class MicroPost(NewebeDocument):
    '''
    Micropost object for micro blogging.
    '''
    author = StringProperty()
    content = StringProperty(required=True)
    date = DateTimeProperty(default=datetime.datetime.now())
 

