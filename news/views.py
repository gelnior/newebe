import datetime
import logging

from django.utils import simplejson as json

from newebe.lib.resource import RestResource, NewebeResource
from newebe.lib.response import BadRequestResponse, CreationResponse, \
                                SuccessResponse, DocumentResponse

from newebe.lib.date_util import getDbDateFromUrlDate

from newebe.core.models import ContactManager
from newebe.news.models import MicroPostManager

from urllib2 import Request, urlopen


def sendDocumentToContacts(path, doc, method = 'POST'):
    '''
    Utility function to send documents to given path for all your contacts.
    '''
    logger = logging.getLogger("newebe.news")

    for contact in ContactManager.getTrustedContacts():

        logger.info("Sending document to %s" %contact.url)
        try:
            url = "%s%s" % (contact.url, path)
            logger.debug("Document sent to %s\n" % url)
            req = Request(url, doc.toJson())
            req.get_method = lambda: method
            response = urlopen(req)
            data = response.read()

            dataDict = json.loads(data)
            if not "success" in dataDict:
              logger.error("Sending failed")
            else: 
              logger.info("Sending succeeds")


        except Exception, err:
            logger.error('%s\n' % str(err))
            logger.error("Sending failed")

            pass

def sendDeleteDocumentToContacts(path, doc):
    sendDocumentToContacts(path, doc, 'DELETE')



class MicroPostResource(NewebeResource):
    '''
    This is the main resource of the application. It allows :
     * GET : to retrieve news by pack (number = NEWS_LIMIT) from a given date.
     * POST : to create news.
     * DELETE : to delete news.
    '''

    def __init__(self):
        self.methods = ['GET', 'POST']
        

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
            microposts = MicroPostManager.getList(dateString)

        else:
            microposts = MicroPostManager.getList()
            
        return DocumentResponse(microposts)

       
    def DELETE(self, request, startKey):
        '''
        Delete extract start key date from URL. Start key is the datetime 
        corresponding at micro post entry. It retrieves the post which have the 
        same datetime and delete it if it exists.
        '''

        if startKey:
            dateString = getDbDateFromUrlDate(startKey)
            microPost = MicroPostManager.getFirst(dateString)

            if microPost:  
                microPost.delete()
                sendDeleteDocumentToContacts("news/microposts/contacts/", \
                                             microPost)

                return SuccessResponse("Micro post deletion succeeds.")
            else:
                return BadRequestResponse(
                        "No micro post for this date. Nothing was deleted.")
    
        else:
            return BadRequestResponse("No date given, nothing was deleted.")




