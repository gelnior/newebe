from couchdbkit.schema import StringProperty, BooleanProperty

from newebe.core.models import NewebeDocument

PICTURE_LIMIT = 10


class PictureManager():
    '''
    Utility methods to retrieve pictures data.
    '''
    
    @staticmethod
    def get_last_pictures(startKey=None, skip=0):
        '''
        Returns all pictures. If *startKey* is provided, it returns last
        picture posted until *startKey*.
        '''

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

    
    @staticmethod
    def get_owner_last_pictures(startKey=None, skip=0):
        '''
        Returns owner pictures. If *startKey* is provided, it returns last
        picture posted by owner until *startKey*.
        '''

        if startKey:
            return Picture.view("pictures/owner", 
                             startkey=startKey, 
                             descending=True, 
                             limit=PICTURE_LIMIT,
                             skip=0)
        else:
            return Picture.view("pictures/owner", 
                             descending=True, 
                             limit=PICTURE_LIMIT)


    @staticmethod
    def get_picture(id):
        '''
        Returns picture corresponding to given ID.
        '''

        pictures = Picture.view("pictures/all", key=id)

        if pictures:        
            return pictures.first()

        return None


    @staticmethod
    def get_contact_picture(contactKey, date):
        '''
        Returns picture corresponding to given ID.
        '''

        pictures = Picture.view("pictures/contact", key=[contactKey, date])

        if pictures:        
            return pictures.first()

        return None


class Picture(NewebeDocument):
    '''
    Picture document for picture storage. Picture describes image posted by
    Newebe owner and his contacts.
    '''
    
    author = StringProperty()
    title = StringProperty(required=True)
    isMine = BooleanProperty(required=True, default=True)
    path = StringProperty()
    contentType = StringProperty()
    isFile = BooleanProperty(required=True, default=False)

