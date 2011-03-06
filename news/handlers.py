import logging
import datetime


from django.utils import simplejson as json
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from tornado.web import RequestHandler, asynchronous, HTTPError


from newebe.lib.response import JSON_MIMETYPE 
from newebe.lib import json_util
from newebe.news.models import MicroPostManager, MicroPost
from newebe.activities.models import Activity
from newebe.lib.date_util import getDateFromDbDate

from newebe.core.models import ContactManager, UserManager


connections = []
logger = logging.getLogger("newebe.news")


class NewsSuscribeHandler(RequestHandler):

    @asynchronous
    def get(self):
        '''
        # TODO
        '''
        logger.info("Long polling incoming")
        connections.append(self.async_callback(self.on_new_message))

    def on_new_message(self, response_data):
        '''
        # TODO
        '''
        self.write(response_data)
        self.finish()



class NewsContactHandler(RequestHandler):
    '''
    This resource allows authorized contacts to send their microposts.
    '''

    def post(self):
        '''
        When post request is recieved, micropost content is expected inside
        a string under *content* of JSON object. It is extracted from it
        then stored inside a new Microposts object. Micropost author is 
        automatically set with current user and current date is set as date.

        It converts carriage return to a <br /> HTML tag.
        '''
        data = self.request.body

        if data:
            #try:
                postedMicropost = json.loads(data)
                date = getDateFromDbDate(postedMicropost["date"])

                micropost = MicroPost(
                    authorKey = postedMicropost["authorKey"],
                    author = postedMicropost["author"],
                    content = postedMicropost['content'],
                    date = date,
                )
                micropost.save()
                # Save corresponding activity
                activity = Activity(
                    authorKey = micropost.author,
                    author = micropost.authorKey,
                    docId = micropost._id,
                    verb = "writes",
                    isMine = False,
                    date = date
                )
                activity.save()

                for connection in connections:
                    connection(micropost.toJson())
                #connections = []

                logger.info("Micropost from %s recieved" % micropost.author)
                self.set_status(201)
                self.set_header("Content-Type", JSON_MIMETYPE)
                self.write(micropost.toJson())
                self.finish()

            
            #except Exception:
            #    raise tornado.web.HTTPError(405,
            #        "Sent data are not correctly formatted.")

        else:
            raise HTTPError(405, "No data sent.")




class NewsHandler(RequestHandler):

    @asynchronous
    def get(self):
        '''
        Return microposts by pack of NEWS_LIMIT at JSON format. If a start key 
        is given in URL (it means a date like 2010-10-05-12-30-48), 
        microposts from this date are returned. Else latest news are returned. 

        Arguments:
            *startKey* The date from where news should be returned.
        '''
        microposts = list()

        self.set_header("Content-Type", JSON_MIMETYPE)
        microposts = MicroPostManager.getList()
        self.write(json_util.getJsonFromDocList(microposts))

        self.finish()


    @asynchronous
    def onContactResponse(self, response, **kwargs):
        '''
        # TODO
        '''
        print self.activity

        if response.error: 
            logger.error("Post to a contact failed")
        else: 
            logger.info("Post successfully sent")
        self.clear()


    @asynchronous
    def post(self):
        '''
        When post request is recieved, micropost data are expected as
        a JSON object. It is extracted from it
        then stored inside a new Microposts object. Micropost author is 
        automatically set with current user and current date is set as date.

        It converts carriage return to a <br /> HTML tag.

        Created microposts are forwarded to contacts.
        '''
        
        logger.info("Micropost post received.")
        data = self.request.body

        if data:

            # Save post locally
            data = data.replace('\n\r', '<br />').replace('\r\n', '<br />')
            data = data.replace('\n', '<br />').replace('\r', '<br />')
            postedMicropost = json.loads(data)

            user = UserManager.getUser()
            micropost = MicroPost(
                authorKey = user.key,
                author = user.name,
                content = postedMicropost['content'],
                date = datetime.datetime.now(),
            )
            micropost.save()

            # Save corresponding activity
            print micropost
            activity = Activity(
                authorKey = user.key,
                author = user.name,
                verb = "writes",
                docId = micropost._id
            )
            activity.save()
            self.activity = activity
    
            # Forward post to contacts
            httpClient = AsyncHTTPClient()            
            for contact in ContactManager.getTrustedContacts():
                url = contact.url.encode("utf-8") + 'news/microposts/contacts/'
                body = micropost.toJson()
                request = HTTPRequest(url, method = "POST", body = body)
                httpClient.fetch(request, self.onContactResponse)

            self.set_status(201)
            self.set_header("Content-Type", JSON_MIMETYPE)            
            self.write(micropost.toJson())
    
        else: 
            raise HTTPError(405,
                    "Sent data were incorrects. No post was created.")


        logger.info("Micropost posted.")
        self.finish()
