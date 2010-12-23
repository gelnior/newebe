import datetime

from django.utils import simplejson as json

from newebe.lib.rest import NewebeResource, JsonResponse, ErrorResponse, \
                            CreationResponse, SuccessResponse
from newebe.lib.date_util import getDbDateFromUrlDate
from newebe.lib import json_util

from newebe.platform.models import UserManager
from newebe.news.models import News, NewsManager


class NewsItemResource(NewebeResource):
    '''
    This is the main resource of the application. It allows :
     * GET : to retrieve news by pack (number = NEWS_LIMIT) from a given date.
     * POST : to create news.
     * DELETE : to delete news.
    '''

    def __init__(self):
        self.methods = ['GET', 'POST', 'DELETE']
        

    def GET(self, request, startKey = None):
        '''
        Return news by pack of NEWS_LIMIT at JSON format. If a start key 
        is given in URL (it means a date like 2010-10-05-12-30-48), 
        news from this date are returned. Else latest news are returned. 

        Arguments:
            *startKey* The date from where news should be returned.
        '''
        newss = list()

        if startKey:
            dateString = getDbDateFromUrlDate(startKey)
            newss = NewsManager.getList(dateString)

        else:
            newss = NewsManager.getList()
            
        return JsonResponse(json_util.getJsonFromDocList(newss))

        
    def POST(self, request):
        '''
        When post request is recieved, news content is expected inside
        a json object under member *content*. It is extracted from it
        then stored inside a new News object. News author is automatically
        set with current user (TODO) and current date is set as date.

        It converts carriage return to a <br /> HTML tag.
        '''
        data = request.raw_post_data

        if data:
            data = data.replace('\n\r', '<br />').replace('\r\n', '<br />')
            data = data.replace('\n', '<br />').replace('\r', '<br />')
            postedNews = json.loads(data)

            news = News()
            news.author = UserManager.getUser().name
            news.content = postedNews['content']
            news.date = datetime.datetime.now()
            news.save()

            return CreationResponse(news.toJson())
    
        else: 
            return ErrorResponse("News item has not been created.")


    def DELETE(self, request, startKey):
        '''
        Delete extract start key date from URL. Start key is the datetime 
        corresponding at news entry. It retrieves post which have the same
        datetime and delete it if it exists.
        '''

        if startKey:
            dateString = getDbDateFromUrlDate(startKey)
            news = NewsManager.getFirst(dateString)

            if news:  
                news.delete()
                return SuccessResponse("Delete succeeds.")
            else:
                return ErrorResponse("No micro post for this date.")
    
        else:
            return ErrorResponse("No date given, no micro post deleted.")
        
