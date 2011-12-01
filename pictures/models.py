import datetime

from couchdbkit.schema import StringProperty, BooleanProperty, \
                                         DateTimeProperty

from newebe.core.models import NewebeDocument

PICTURE_LIMIT = 50

class PictureManager():
    '''
    Utility methods to retrieve pictures data.
    '''
    
    @staticmethod
    def get_last_pictures(startKey=None, skip=0):
        if startKey:
            return Picture.view("pictures/last", 
                             startkey=startKey, 
                             descending=True, 
                             limit=PICTURE_LIMIT,
                             skip=0)
        else:
            return Picture.view("pictures/last", 
                             descending=True, 
                             limit=PICTURE_LIMIT)



class Picture(NewebeDocument):
    '''
    Picture document for picture storage. Picture describes image posted by
    Newebe owner and his contacts.
    '''
    
    author = StringProperty()
    title = StringProperty(required=True)
    isMine = BooleanProperty(required=True, default=True)
    path = StringProperty()

