import datetime
import logging

from tornado.web import asynchronous
from tornado.httpclient import AsyncHTTPClient, HTTPRequest

from newebe.lib import date_util

from newebe.profile.models import UserManager
from newebe.contacts.models import ContactManager
from newebe.news.models import MicroPostManager
from newebe.core.handlers import NewebeAuthHandler, NewebeHandler

from newebe.news.handlers import CONTACT_PATH as MICROPOST_PATH

logger = logging.getLogger("newebe.sync")


class SynchronizeHandler(NewebeAuthHandler):
    '''
    Handles synchronization request.

    * GET: Asks for all contacts to resend their data from last month. As answer
    contacts send their profile. So contact data are updated, then contacts
    resend all their from their last month just like they were posted now.
    Current newebe has to check himself if he already has these data.
    '''


    @asynchronous
    def get(self):
        '''
        Asks for all contacts to resend their data from last month. 
        As answer contacts send their profile. So contact data are updated, 
        then contacts resend all their from their last month just like they 
        were posted now.
        Current newebe has to check himself if he already has these data.
        '''

        client = AsyncHTTPClient()
        user = UserManager.getUser()

        self.contacts = dict()
        for contact in ContactManager.getTrustedContacts():
            self.ask_to_contact_for_sync(client, user, contact)

        self.return_success("", 200)


    @asynchronous
    def ask_to_contact_for_sync(self, client, user, contact):
        '''
        Sends a sync request to *contact*.
        '''

        body = user.asContact().toJson()
        logger.info("Start syncing with : " + contact.url)
        request = HTTPRequest(url = contact.url + "synchronize/contact/", 
                              method = "POST",
                              body = body)
        self.contacts[request] = contact
        client.fetch(request = request, callback = self.on_synchronize_posts) 


    def on_synchronize_posts(self, response, **kwargs):
        '''
        When sync response is received, it extracts contact data from it
        then update local contact with it.
        '''

        if not response.error:
            contact = self.contacts[response.request]

            if contact:
                remoteContact = self.get_json_from_response(response)["rows"][0]
                contact.name = remoteContact.get("name", "")
                contact.description = remoteContact.get("description", "")
                contact.save()
        

class SynchronizeContactHandler(NewebeHandler):
    '''
    Handler used to handle sync request.
    '''


    @asynchronous
    def post(self):
        '''
        When sync request is received, if contact is a trusted contact, it
        sends again all posts from last month to contact.
        '''
            
        client = AsyncHTTPClient()
        now = datetime.datetime.now() 
        date = now - datetime.timedelta(365/12)

        contact = self.get_body_as_dict()
        localContact = ContactManager.getTrustedContact(contact.get("key", ""))

        if localContact:
            self.send_posts_to_contact(client, localContact, now, date)

            self.return_document(UserManager.getUser().asContact())
        else:
            self.return_failure("Contact does not exist.")


    def send_posts_to_contact(self, client, contact, now, date):
        '''
        Send microposts from last month to given contact.
        '''

        microposts = MicroPostManager.get_mine(
                startKey=date_util.get_db_date_from_date(now), 
                endKey=date_util.get_db_date_from_date(date))

        for micropost in microposts:
            url = contact.url.encode("utf-8") + MICROPOST_PATH
            body = micropost.toJson()

            request = HTTPRequest(url, method = "POST", body = body)
            client.fetch(request, self.onContactResponse)


    def onContactResponse(self, response, **kwargs):
        pass

