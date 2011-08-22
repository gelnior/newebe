import datetime

from newebe.lib import date_util
from tornado.web import asynchronous
#from tornado.httpserver import HTTPRequest
from tornado.httpclient import AsyncHTTPClient, HTTPRequest

from newebe.core.handlers import NewebeAuthHandler, NewebeHandler

from newebe.core.models import UserManager, ContactManager
from newebe.news.models import MicroPostManager

from newebe.news.handlers import CONTACT_PATH as MICROPOST_PATH

import logging
logger = logging.getLogger("newebe.sync")

class SynchronizeHandler(NewebeAuthHandler):
    '''
    '''


    @asynchronous
    def get(self):        
        client = AsyncHTTPClient()
        user = UserManager.getUser()

        self.contacts = dict()
        for contact in ContactManager.getTrustedContacts():
            body = user.asContact().toJson()
            logger.info(contact.url)
            request = HTTPRequest(url = contact.url + "synchronize/contact/", 
                                  method = "POST",
                                  body = body)
            self.contacts[request] = contact
            client.fetch(request = request, callback = self.on_synchronize_posts) 

        self.return_success("", 200)


    def on_synchronize_posts(self, response, **kwargs):        
        if not response.error:
            contact = self.contacts[response.request]
            if contact:
                remoteContact = self.get_json_from_response(response)["rows"][0]
                contact.name = remoteContact.get("name","")
                contact.description = remoteContact.get("description","")
                contact.save()
        
class SynchronizeContactHandler(NewebeHandler):

    @asynchronous
    def post(self):
        client = AsyncHTTPClient()
        now = datetime.datetime.now() 
        date = now - datetime.timedelta(365/12)
        contact = self.get_body_as_dict()
        localContact = ContactManager.getTrustedContact(contact.get("key", ""))

        logger.info(date_util.get_db_date_from_date(date))
        if localContact:

            microposts = MicroPostManager.getMine(
                    startKey=date_util.get_db_date_from_date(now), 
                    endKey=date_util.get_db_date_from_date(date))
            logger.info(microposts.all())
            for micropost in microposts.all():
                url = localContact.url.encode("utf-8") + MICROPOST_PATH
                body = micropost.toJson()

                request = HTTPRequest(url, method = "POST", body = body)
                client.fetch(request, self.onContactResponse)

            self.return_document(UserManager.getUser().asContact())
        else:
            self.return_failure("Contact does not exist.")


    def onContactResponse(self, response, **kwargs):
        pass

