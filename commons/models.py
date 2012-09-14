from couchdbkit.schema import StringProperty, BooleanProperty

from newebe.core.models import NewebeDocument, DocumentManager

COMMON_LIMIT = 10


class CommonManager():
    '''
    Utility methods to retrieve commons data.
    '''

    @staticmethod
    def get_last_commons(startKey=None, skip=0,
            limit=COMMON_LIMIT, tag=None):
        '''
        Returns all commons. If *startKey* is provided, it returns last
        common posted until *startKey*.
        '''
        return DocumentManager.get_tagged_documents(Common, "commons/last",
            "commons/tags", startKey, tag, limit, skip)

    @staticmethod
    def get_owner_last_commons(startKey=None,
                 skip=0, limit=COMMON_LIMIT, tag=None):
        '''
        Returns owner commons. If *startKey* is provided, it returns last
        common posted by owner until *startKey*.
        '''
        return DocumentManager.get_tagged_documents(Common, "commons/owner",
            "commons/mine-tags", startKey, tag, limit, skip)

    @staticmethod
    def get_common(id):
        '''
        Returns common corresponding to given ID.
        '''
        commons = Common.view("commons/all", key=id)

        if commons:
            return commons.first()

        return None

    @staticmethod
    def get_contact_common(contactKey, date):
        '''
        Returns common corresponding to given ID.
        '''
        commons = Common.view("commons/contact", key=[contactKey, date])

        if commons:
            return commons.first()

        return None


class Common(NewebeDocument):
    '''
    Common document for common storage. Common describes image posted by
    Newebe owner and his contacts.
    '''

    author = StringProperty()
    title = StringProperty(required=True)
    isMine = BooleanProperty(required=True, default=True)
    path = StringProperty()
    contentType = StringProperty()
    isFile = BooleanProperty(required=True, default=False)

    def get_path(self):
        '''
        Return path where micropost could be find.
        '''
        return "commons/{}/".format(self._id)
