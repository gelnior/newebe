import datetime
from django.utils import simplejson as json
from django.views.decorators.csrf import csrf_protect

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse

from couchdbkit.ext.django.forms import document_to_dict

from newebe.news.models import News
from newebe.news.forms import NewsForm, News
from newebe.news import news_settings

from newebe.lib.rest import *
from newebe.lib.date_util import *
from newebe.lib import json_util

class WallResource(RestResource):
    '''
    This resource returns the main page of the application containing 
    all widgets. List of news is empty. 
    '''

    methods = ['GET',]

    def GET(self, request):
        '''
        Return corresponding template.
        '''
        return render_to_response("news/wall.html", 
                                  context_instance=RequestContext(request))


class NewsItemResource(RestResource):
    '''
    This is the main resource of the application. It allows :
     * GET : to retrieve news by pack (number = NEWS_LIMIT) from a given date.
     * POST : to create news.
     * DELETE : to delete news.
    '''

    # Methods allowed.
    methods = ['GET', 'POST', 'DELETE']

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
            newss = News.view("news/all", 
                              startkey = dateString, 
                              descending=True, 
                              limit=news_settings.NEWS_LIMIT+1, 
                              skip=1)

        else:
            newss = News.view("news/all", 
                              descending=True, 
                              limit=news_settings.NEWS_LIMIT)
            
        return JsonResponse(json_util.getJsonFromDocList(newss))

        
    def POST(self, request):
        data = request.raw_post_data

        if data:
            postedNews = json.loads(data)
            news = News()
            news.author = "Gelnior"
            news.content = postedNews['content']
            news.date = datetime.datetime.now()
            news.save()

            return CreationResponse(news.toJson())
    
        else: 
            return ErrorResponse("News item has not been created. ")


    def DELETE(self, request, startKey):
        if startKey:
            dateString = getDbDateFromUrlDate(startKey)
            newss = News.view("news/all",
                              key=dateString)

            if newss:  
                for news in newss:
                    news.delete()

            return SuccessResponse("Delete succeeds.")
    
        else:
            return ErrorResponse("No item for this date.")
        
