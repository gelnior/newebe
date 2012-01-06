import logging
import markdown

from tornado.escape import json_decode
from tornado.httpclient import HTTPClient, HTTPRequest
from tornado.web import asynchronous, HTTPError

from newebe.lib import date_util
from newebe.news.models import MicroPostManager, MicroPost
from newebe.activities.models import ActivityManager
from newebe.contacts.models import ContactManager
from newebe.profile.models import UserManager
from newebe.core.handlers import NewebeHandler, NewebeAuthHandler

logger = logging.getLogger("newebe.news")

# When a new post is created, it is forwarded to contacts via POST requests. 
# CONTACT_PATH is the end of the URI where data are sent. Full URI is 
# (contact URI + CONTACT_PATH).
CONTACT_PATH = 'news/microposts/contacts/'

# Long polling queue
connections = []


class NewsSuscribeHandler(NewebeAuthHandler):
    '''
    Handler that managers long polling connections.
    '''


    @asynchronous
    def get(self):
        '''
        Add request to the waiting queue. When a new post will come, this
        handler callback will be called then a response with new post 
        will be sent to client that made this request.
        '''

        logger.info("Long polling incoming")
        connections.append(self.async_callback(self.on_new_post))


    def on_new_post(self, response_data):
        '''
        When new post arrives, it sends it to client requesting for new
        posts.
        '''

        self.write(response_data)
        self.finish()


class MicropostHandler(NewebeAuthHandler):
    '''
    Manage single post data :
    * GET request returns post corresponding to the id given in the request URL.
    * DELETE request deletes post corresponding to the id given in the request 
    URL. Then send the delete request to contacts.
    '''
    

    def get(self, postId):
        '''
        GET request returns post corresponding to the id given in the request 
        URL.
        '''

        micropost = MicroPostManager.get_micropost(postId)
        self.return_one_document_or_404(micropost)


    @asynchronous
    def delete(self, id):
        '''
        Deletes the post of which id is equal to postId, add an activity and 
        forwards the delete request to each trusted contact.

        put instead of delete because tornado does not support body in DELETE 
        requests...
        '''

        micropost = MicroPostManager.get_micropost(id)

        if micropost:            
            user = UserManager.getUser()

            if micropost.authorKey == user.key:
                self.create_owner_deletion_activity(
                    micropost, "deletes", "micropost")  
                self.send_deletion_to_contacts(CONTACT_PATH, micropost)
            micropost.delete()
            self.return_success("Micropost deletion succeeds.")
            
        else:
            self.return_failure("Micropost not found.", 404)


class NewsHandler(NewebeAuthHandler):
    '''
    This handler handles request that retrieve lists of news.
    GET : Retrieve last NEWS_LIMIT microposts published before a given date.
    POST : Creates a new microposts and forward the activity to contacts.
    '''


    @asynchronous
    def get(self, startKey=None):
        '''
        Return microposts by pack of NEWS_LIMIT at JSON format. If a start key 
        is given in URL (it means a date like 2010-10-05-12-30-48), 
        microposts from this date are returned. Else latest news are returned. 

        Arguments:
            *startKey* The date from where news should be returned.
        '''

        microposts = list()

        if startKey:
            dateString = date_util.get_db_utc_date_from_url_date(startKey)
            microposts = MicroPostManager.get_list(dateString)

        else:
            microposts = MicroPostManager.get_list()

        self.return_documents(microposts)


    @asynchronous
    def post(self):
        '''
        When post request is recieved, micropost data are expected as
        a JSON object. It is extracted from it
        then stored inside a new Microposts object. Micropost author is 
        automatically set with current user and current date is set as date.

        Created microposts are forwarded to contacts.
        '''
        
        logger.info("Micropost post received.")

        data = self.get_body_as_dict()
        if data and "content" in data:

            user = UserManager.getUser()
            micropost = MicroPost(
                authorKey = user.key,
                author = user.name,
                content = data['content'],
            )
            micropost.save()

            self.create_owner_creation_activity(micropost, 
                                                "writes", "micropost")
            self.send_creation_to_contacts(CONTACT_PATH, micropost)
                          
            logger.info("Micropost successfuly posted.") 
            self.return_json(micropost.toJson(), 201)
    
        else: 
            self.return_failure(
                    "Sent data were incorrects. No post was created.", 405)

        

class NewsContactHandler(NewebeHandler):
    '''
    This resource allows authorized contacts to send their microposts.
    '''


    def post(self):
        '''
        When post request is received, micropost content is expected inside
        a string under *content* of JSON object. It is extracted from it
        then stored inside a new Microposts object. Micropost author and date
        are set from incoming data.
        '''

        data = self.get_body_as_dict()

        if data and "date" in data and "authorKey" in data:
            db_date = data.get("date")
            date = date_util.get_date_from_db_date(db_date)
            authorKey = data.get("authorKey")

            contact = ContactManager.getTrustedContact(authorKey)
            micropost = MicroPostManager.get_contact_micropost(
                             authorKey, db_date)

            if not micropost and contact:
                micropost = MicroPost(
                    authorKey = authorKey,
                    author = data["author"],
                    content = data['content'],
                    date = date,
                    isMine = False
                )
                micropost.save()

                self.create_creation_activity(contact, micropost, 
                        "writes", "micropost")
                self._notify_suscribers(micropost)
                self._write_create_log(micropost)
            
            self.return_json(micropost.toJson(), 201)

        else:
            self.return_failure("No data sent.", 405)


    def _notify_suscribers(self, micropost):
        '''
        Notify suscribed client (long polling requests) that a *micropost*
        has been saved. It sends them the micropost content.
        '''

        while connections:
            connection = connections.pop() 
            connection(micropost.toJson())


    def _write_create_log(self, micropost):
        '''
        Print a log telling that an incoming micropost has been saved.
        '''

        logger.info("Micropost from %s recieved" % micropost.author)


    def put(self):
        '''
        When a delete request from a contact is incoming, it executes the 
        delete request locally then it creates a new activity corresponding
        to this deletion.
        '''

        data = self.get_body_as_dict()

        if data and "authorKey" in data and "date" in data:
            authorKey = data["authorKey"]
            date = data["date"]

            micropost = MicroPostManager.get_contact_micropost(authorKey, date)
            contact = ContactManager.getTrustedContact(authorKey)

            if micropost and contact:
                self.create_deletion_activity(contact, micropost, "deletes",
                        "micropost")
                micropost.delete()

                self._write_delete_log(micropost)
                self.return_success("Micropost deleted.")

            else:
                self.return_failure("Micropost not found", 404)

        else:
            self.return_failure("No data sent.", 400)


    def _write_delete_log(self, micropost):
        '''
        Prints a log telling that an incoming micropost has been saved.
        '''

        logger.info("Micropost deletion from %s received" % micropost.author)


class MicropostTHandler(NewebeAuthHandler):
    '''
    This handler allows to retrieve micropost at HTML format.
    * GET: Return for given id the HTML representation of corresponding 
           micropost.
    '''
    

    def get(self, postId):
        '''
        Returns for given id the HTML representation of corresponding 
        micropost.
        '''

        micropost = MicroPostManager.get_micropost(postId)
        if micropost:

            if micropost.content:
                 micropost.content = markdown.markdown(micropost.content)

            self.render("templates/micropost.html", micropost=micropost)
        else:
            raise HTTPError("Micropost not found.", 404)


class NewsRetryHandler(NewebeAuthHandler):


    def post(self, key):
        '''
        Resend post with *key* as key to the contact given in the posted
        JSON. Corresponding activity ID is given inside the posted json.
        Here is the format : {"contactId":"data","activityId":"data"}
        '''

        micropost = MicroPostManager.get_micropost(key)
        idInfos = self.request.body

        ids = json_decode(idInfos)

        if micropost and idInfos:

            contactId = ids["contactId"]
            activityId = ids["activityId"]

            contact = ContactManager.getTrustedContact(contactId)
            activity = ActivityManager.get_activity(activityId)

            if not contact:
                self.return_failure("Contact not found", 404)
            elif not activity:
                self.return_failure("Activity not found", 404)
            else:           
                logger.info("Attemp to resend a post to contact: {}.".format(
                    contact.name))
                self.forward_to_contact(micropost, contact, activity)
        else:
            self.return_failure("Micropost not found", 404)


    def forward_to_contact(self, micropost, contact, activity, method = "POST"):
        '''
        *micropost* is sent to *contact* via a request of which method is set 
        as *method*. If request succeeds, error linked to this contact
        is removed. Else nothing is done and error code is returned.
        '''

        httpClient = HTTPClient()            
        url = contact.url.encode("utf-8") + CONTACT_PATH
        body = micropost.toJson(localized=False)

        request = HTTPRequest(url, method = method, body = body)

        try:
            response = httpClient.fetch(request)
            
            if response.error:
                self.return_failure("Posting micropost to contact failed.")

            else:
                for error in activity.errors:
                    if error["contactKey"] == contact.key:
                        activity.errors.remove(error)
                        activity.save()
                        self.return_success("Micropost correctly resent.")

        except:
            self.return_failure("Posting micropost to contact failed.")

       
    def put(self, key):
        '''
        Resend deletion of micropost with *key* as key to the contact given in 
        the posted JSON. Corresponding activity ID is given inside the posted 
        json.
        Here is the format : {"contactId":"data","activityId":"data"}
        '''
        idInfos = self.request.body

        ids = json_decode(idInfos)

        if ids:

            contactId = ids["contactId"]
            activityId = ids["activityId"]
            date = ids["extra"]

            contact = ContactManager.getTrustedContact(contactId)
            activity = ActivityManager.get_activity(activityId)

            if not contact:
                self.return_failure("Contact not found", 404)
            elif not activity:
                self.return_failure("Activity not found", 404)
            else:

                user = UserManager.getUser()
                micropost = MicroPost(
                    authorKey = user.key, 
                    date = date_util.get_date_from_db_date(date)
                )
                
                logger.info(
                    "Attemp to resend a post deletion to contact: {}.".format(
                        contact.name))

                self.forward_to_contact(micropost, contact, activity, 
                                        method = "PUT")

        else:
            self.return_failure("Micropost not found", 404)


class MyNewsHandler(NewebeAuthHandler):
    '''
    This handler handles request that retrieve lists of news published by
    Newebe owner.
    GET : Retrieve last 10 microposts published before a given date by owner.
    '''


    def get(self, startKey=None):
        '''
        Return microposts by pack of NEWS_LIMIT at JSON format. If a start key 
        is given in URL (it means a date like 2010-10-05-12-30-48), 
        microposts from this date are returned. Else latest news are returned. 
        Only microposts published by Newebe owner are returned.

        Arguments:
            *startKey* The date from where news should be returned.
        '''

        microposts = list()

        if startKey:
            dateString = date_util.get_db_utc_date_from_url_date(startKey)
            microposts = MicroPostManager.get_mine(dateString)

        else:
            microposts = MicroPostManager.get_mine()

        self.return_documents(microposts)
    

# Template handlers

class NewsTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/news.html")


class NewsContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/news_content.html")


class NewsTutorial1THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/tutorial_1.html")


class NewsTutorial2THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/tutorial_2.html")

