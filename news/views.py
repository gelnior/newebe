from newebe.lib.resource import NewebeResource
from newebe.lib.response import DocumentResponse

from newebe.lib.date_util import getDbDateFromUrlDate
from newebe.news.models import MicroPostManager



class MicroPostResource(NewebeResource):
    '''
    This is the main resource of the application. It allows :
     * GET : to retrieve news by pack (number = NEWS_LIMIT) from a given date.
    '''

    def __init__(self, isMine=False):
        '''
        Constructor : set isMine to true to tell that micropost is written
        by current user.
        '''
        self.methods = ['GET', 'POST']
        self.isMine = isMine


    def GET(self, request, startKey = None):
        '''
        Return microposts by pack of NEWS_LIMIT at JSON format. If a start key 
        is given in URL (it means a date like 2010-10-05-12-30-48), 
        microposts from this date are returned. Else latest news are returned. 

        Arguments:
            *startKey* The date from where news should be returned.
        '''
        microposts = list()

        if startKey:
            dateString = getDbDateFromUrlDate(startKey)
            if self.isMine:
                microposts = MicroPostManager.getMine(dateString)
            else:
                microposts = MicroPostManager.getList(dateString)

        else:
            if self.isMine:
                microposts = MicroPostManager.getMine()
            else:
                microposts = MicroPostManager.getList()
            
        return DocumentResponse(microposts)

