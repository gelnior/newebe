from couchdbkit.schema import StringProperty, BooleanProperty

from newebe.apps.core.models import NewebeDocument, DocumentManager
from newebe.apps.news import news_settings


class MicroPostManager():
    '''
    Furnishes static methods for easy news database retreiving.
    '''

    @staticmethod
    def get_mine(startKey=None, skip=0, limit=news_settings.NEWS_LIMIT,
                 tag=None):

        '''
        Return last 10 (=NEWS_LIMIT in news_settings.py) micro posts descending
        from current user. If *startKey* is given, it retrieves micro posts
        from startKey.

        Ex: If you need post from November, 2nd 2010, set *startKey*
        as 2010-11-02T23:59:00Z. First element is never included (because of
        pagination).
        '''

        return DocumentManager.get_tagged_documents(MicroPost,
                "news/mine", "news/mine-tags", startKey, tag, limit, skip)

    @staticmethod
    def get_list(startKey=None, skip=0, limit=news_settings.NEWS_LIMIT,
                 tag=None):
        '''
        Return last 10 (=NEWS_LIMIT in news_settings.py) micro posts
        descending.
        If *startKey* is given, it retrieves micro posts from startKey.

        Ex: If you need post from November, 2nd 2010, set *startKey*
        as 2010-11-02T23:59:00Z. First element is never included (because of
        pagination).

        Arguments:
          *startKey* The date from where data should be retrieved
        '''

        return DocumentManager.get_tagged_documents(MicroPost,
                "news/all", "news/tags", startKey, tag, limit, skip)

    @staticmethod
    def get_first(dateKey):
        '''
        Return first micro post written by current user from the list of micro
        posts corresponding to given date. Normally there should be only
        one post for this date, so the list should have only one element.

        Date format is set in news_settings.DB_DATE_FORMAT.

        Arguments:
          *date* Date used to retrieve micro post.
        '''

        return DocumentManager.get_document(MicroPost, "news/all", dateKey)

    @staticmethod
    def get_micropost(mid):
        '''
        Returns post of which id match given *id*.
        '''

        return DocumentManager.get_document(MicroPost, "news/full", mid)

    @staticmethod
    def get_microposts(mids):
        '''
        Returns posts of which id match given *ids*.
        '''

        return MicroPost.view("news/full", keys=mids)

    @staticmethod
    def get_contact_micropost(contactKey, date):
        '''
        Returns all micropost posted by a given contact. Contact key is used
        to retrieve the microposts.
        '''

        return DocumentManager.get_document(
                             MicroPost, "news/contact", key=[contactKey, date])


class MicroPost(NewebeDocument):
    '''
    Micropost object for micro blogging.
    '''

    author = StringProperty()
    content = StringProperty(required=True)
    isMine = BooleanProperty(required=True, default=True)

    def get_path(self):
        '''
        Return path where micropost could be found.
        '''

        return "microposts/{}/".format(self._id)
