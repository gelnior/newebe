import datetime
import logging

from tornado.web import asynchronous

from newebe.lib import date_util
from newebe.lib.http_util import ContactClient

from newebe.apps.profile.models import UserManager
from newebe.apps.contacts.models import ContactManager
from newebe.apps.news.models import MicroPostManager
from newebe.apps.pictures.models import PictureManager
from newebe.apps.commons.models import CommonManager
from newebe.apps.core.handlers import NewebeAuthHandler, NewebeHandler

from newebe.apps.news.handlers import CONTACT_PATH as MICROPOST_PATH
from newebe.apps.pictures.handlers import CONTACT_PATH as PICTURE_PATH
from newebe.apps.commons.handlers import CONTACT_PATH as COMMON_PATH


logger = logging.getLogger("newebe.sync")


class SynchronizeHandler(NewebeAuthHandler):
    '''
    Handles synchronization request.

    * GET: Asks for all contacts to resend their data from last month. As
    answer contacts send their profile. So contact data are updated, then
    contacts resend all their from their last month just like they were posted
    now.
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
        client = ContactClient()
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
        url = "%ssynchronize/contact/" % contact.url
        self.contacts[url] = contact
        client.post(contact, "synchronize/contact/", body,
                    callback=self.on_synchronize)

    def on_synchronize(self, response, **kwargs):
        '''
        When sync response is received, it extracts contact data from it
        then update local contact with it.
        '''
        if not response.error:
            contact = self.contacts[response.request.url]

            if contact:
                json_from_response = self.get_json_from_response(response)
                remoteContact = json_from_response["rows"][0]
                contact.name = remoteContact.get("name", "")
                contact.description = remoteContact.get("description", "")
                contact.save()

def tags_match(doc, contact):
    '''
    Returns true if doc has at least one tag in common with contact.
    '''

    is_tag = False
    for tag in doc.tags:
        if tag in contact.tags:
            is_tag = True
            break
    return is_tag

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
        client = ContactClient()
        now = datetime.datetime.utcnow()
        date = now - datetime.timedelta(365 / 12)

        contact = self.get_body_as_dict()
        localContact = ContactManager.getTrustedContact(contact.get("key", ""))

        if localContact:
            self.send_posts_to_contact(client, localContact, now, date)
            self.send_pictures_to_contact(client, localContact, now, date)
            self.send_commons_to_contact(client, localContact, now, date)

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
            if tags_match(micropost, contact):
                body = micropost.toJson(localized=False)

                client.post(contact, MICROPOST_PATH, body,
                            self.onContactResponse)

    def send_pictures_to_contact(self, client, contact, now, date):
        '''
        Send pictures from last month to given contact.
        '''
        pictures = PictureManager.get_owner_last_pictures(
                startKey=date_util.get_db_date_from_date(now),
                endKey=date_util.get_db_date_from_date(date))

        for picture in pictures:
            if tags_match(picture, contact):
                client.post_files(
                    contact,
                    PICTURE_PATH,
                    {"json": str(picture.toJson(localized=False))},
                    [("picture",
                      str(picture.path),
                      picture.fetch_attachment("th_" + picture.path))
                    ],
                    self.onContactResponse)

    def send_commons_to_contact(self, client, contact, now, date):
        '''
        Send pictures from last month to given contact.
        '''
        commons = CommonManager.get_owner_last_commons(
                startKey=date_util.get_db_date_from_date(now),
                endKey=date_util.get_db_date_from_date(date))

        for common in commons:
            if tags_match(common, contact):
                body = common.toJson(localized=False)

                client.post(contact, COMMON_PATH, body, self.onContactResponse)

    def onContactResponse(self, response, **kwargs):
        pass
