import logging
import datetime
import markdown

from tornado.escape import json_encode, json_decode
from tornado.httpclient import AsyncHTTPClient, HTTPClient, HTTPRequest
from tornado.web import asynchronous, HTTPError

from newebe.lib import json_util
from newebe.lib.date_util import get_date_from_db_date, \
                                 get_db_date_from_url_date
from newebe.news.models import MicroPostManager, MicroPost
from newebe.activities.models import Activity, ActivityManager
from newebe.core.models import ContactManager, UserManager
from newebe.core.handlers import NewebeHandler, NewebeAuthHandler

logger = logging.getLogger("newebe.news")

# When a new post is created, it is forwarded to contacts via POST requests. 
# CONTACT_PATH is # the end of the URI where data are sent. Full URI is 
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
    

    def __init__(self, application, request, **kwargs):
        '''
        Initialize contacts dictionnary. This dictionary linked a request to
        a contact to handle error if request fails.
        '''

        NewebeHandler.__init__(self, application, request, **kwargs)
        self.contacts = dict()


    def get(self, postId):
        '''
        GET request returns post corresponding to the id given in the request 
        URL.
        '''

        micropost = MicroPostManager.getMicropost(postId)
        if micropost:
            self.return_json(micropost.toJson())
        else:
            self.return_failure("Micropost not found.", 404)


    @asynchronous
    def delete(self, postId):
        '''
        Deletes the post of which id is equal to postId, add an activity and 
        forwards the delete request to each trusted contact.

        put instead of delete because tornado does not support body in DELETE 
        requests...
        '''

        micropost = MicroPostManager.getMicropost(postId)
        if micropost:
            self.set_status(200)

            user = UserManager.getUser()

            self.create_delete_activity(user, micropost)
            micropost.delete()

            # Forward delete to contacts
            if micropost.authorKey == user.key:
                self.forward_to_contacts(micropost)

            self.returnSuccess("Micropost deletion succeeds.")
            
        else:
            self.return_failure("Micropost not found.", 404)


    @asynchronous
    def forward_to_contacts(self, micropost):
        '''
        Sends asynchronously delete micropost request to all trusted contacts.
        If an error occurs, it is registered inside corresponding activity
        '''

        httpClient = AsyncHTTPClient()            
        for contact in ContactManager.getTrustedContacts():
            url = contact.url.encode("utf-8") + CONTACT_PATH
            body = micropost.toJson()

            request = HTTPRequest(url, method = "PUT", body = body)
            self.contacts[request] = (contact, micropost)

            try:
                httpClient.fetch(request, self.onContactResponse)
            except:
                self.activity.add_error(contact)
                self.activity.save()


    def onContactResponse(self, response, **kwargs):
        '''
        Callback for delete request sent to contacts. If error occurs it 
        marks it inside the activity for which error occurs.
        '''

        if response.error: 
            logger.error("Sending delete request to a contact failed" \
                    ", error infos are stored inside activity.")

            (contact, micropost) = self.contacts[response.request]

            self.activity.add_error(contact, micropost.date)
            self.activity.save()

            del self.contacts[response.request]

        else: 
            logger.info("Delete post successfully sent.")


    def create_delete_activity(self, user, micropost):
        '''
        Creates a new activity inside database that describes micropost 
        deletion.
        '''

        self.activity = Activity(
            authorKey = user.key,
            author = user.name,
            verb = "deletes",
            docType = "micropost",
            docId = micropost._id,
            method = "DELETE"
        )
        self.activity.save()



class NewsHandler(NewebeAuthHandler):
    '''
    This handler handles request that retrieve lists of news.
    GET : Retrieve last NEWS_LIMIT microposts published before a given date.
    POST : Creates a new microposts and forward the activity to contacts.
    '''


    def __init__(self, application, request, **kwargs):
        NewebeHandler.__init__(self, application, request, **kwargs)
        self.contacts = dict()


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
            dateString = get_db_date_from_url_date(startKey)
            microposts = MicroPostManager.getList(dateString)

        else:
            microposts = MicroPostManager.getList()

        self.return_json(json_util.getJsonFromDocList(microposts))


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

        data = self.request.body
        if data:

            # Save post locally
            postedMicropost = json_decode(data)

            user = UserManager.getUser()
            micropost = MicroPost(
                authorKey = user.key,
                author = user.name,
                content = postedMicropost['content'],
                date = datetime.datetime.now(),
            )
            micropost.save()

            self.create_post_activity(user, micropost)
            self.forward_to_contacts(micropost)
               
            self.set_status(201)
            self.return_json(micropost.toJson())
    
        else: 
            self.return_failure(
                    "Sent data were incorrects. No post was created.", 405)


    @asynchronous
    def forward_to_contacts(self, micropost):
        '''
        Sends asynchronously newly created micropost to trusted contacts.
        '''

        httpClient = AsyncHTTPClient()            
        for contact in ContactManager.getTrustedContacts():
            url = contact.url.encode("utf-8") + CONTACT_PATH
            body = micropost.toJson()

            request = HTTPRequest(url, method = "POST", body = body)
            self.contacts[request] = contact
            try:
                httpClient.fetch(request, self.onContactResponse)
            except:
                self.activity.add_error(contact)
                self.activity.save()


    def onContactResponse(self, response, **kwargs):
        '''
        Callback for post request sent to contacts. If error occurs it 
        marks it inside the activity for which error occurs. Else 
        it logs that micropost posting succeeds.
        '''

        if response.error: 
            logger.error("Post to a contact failed, error infos are stored " \
                    "inside activity.")
            contact = self.contacts[response.request]
            self.activity.add_error(contact)
            self.activity.save()

            del self.contacts[response.request]

        else: 
            logger.info("Post successfully sent.")
        

    def create_post_activity(self, user, micropost):
        '''
        Creates an activity describing micropost creation.
        '''

        self.activity = Activity(
            authorKey = user.key,
            author = user.name,
            verb = "writes",
            docType = "micropost",
            docId = micropost._id
        )
        self.activity.save()


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

        data = self.request.body

        if data:
            postedMicropost = json_decode(data)
            date = get_date_from_db_date(postedMicropost["date"])

            micropost = MicroPost(
                authorKey = postedMicropost["authorKey"],
                author = postedMicropost["author"],
                content = postedMicropost['content'],
                date = date,
                isMine = False
            )
            micropost.save()

            self.create_write_activity(micropost, date)
            self.notify_suscribers(micropost)
            self.write_create_log(micropost)
            
            self.return_json(micropost.toJson(), 201)

        else:
            self.return_failure("No data sent.", 405)


    def create_write_activity(self, micropost, date):
        '''
        Creates an activity telling that a micropost has been written.
        The activity is linked to *micropost* and its date is set to *date*.
        '''

        activity = Activity(
            authorKey = micropost.authorKey,
            author = micropost.author,
            verb = "writes",
            docType = "micropost",
            docId = micropost._id,
            isMine = False,
            date = date
        )
        activity.save()


    def notify_suscribers(self, micropost):
        '''
        Notify suscribed client (long polling requests) that a *micropost*
        has been saved. It sends them the micropost content.
        '''

        while connections:
            connection = connections.pop() 
            connection(micropost.toJson())


    def write_create_log(self, micropost):
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

        data = self.request.body

        if data:
            deletedMicropost = json_decode(data)
            micropost = MicroPostManager.getContactMicropost(
                 deletedMicropost["authorKey"], deletedMicropost["date"])
            
            if micropost:
                self.create_delete_activity(micropost)
                micropost.delete()

                self.write_delete_log(micropost)
                self.returnSuccess("Micropost deleted.")

            else:
                self.return_failure("Micropost not found", 404)

        else:
            self.return_failure("No data sent.", 405)


    def write_delete_log(self, micropost):
        '''
        Prints a log telling that an incoming micropost has been saved.
        '''

        logger.info("Micropost deletion from %s received" % micropost.author)


    def create_delete_activity(self, micropost):
        '''
        Creates an activity telling that a micropost deletion occured.
        *micropost* data are set in the activity.
        '''

        activity = Activity(
            authorKey = micropost.authorKey,
            author = micropost.author,
            docId = micropost._id,
            verb = "deletes",
            isMine = False,
            docType = "Micropost",
            method = "DELETE"
        )
        activity.save()


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

        micropost = MicroPostManager.getMicropost(postId)
        if micropost:

            if micropost.content:
                 micropost.content = markdown.markdown(micropost.content)

            self.render("../templates/news/micropost.html", micropost=micropost)
        else:
            raise HTTPError("Micropost not found.", 404)


class NewsRetryHandler(NewebeAuthHandler):


    def post(self, key):
        '''
        Resend post with *key* as key to the contact given in the posted
        JSON. Corresponding activity ID is given inside the posted json.
        Here is the format : {"contactId":"data","activityId":"data"}
        '''
        micropost = MicroPostManager.getMicropost(key)
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
        body = micropost.toJson()

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
                        self.returnSuccess("Micropost correctly resent.")

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
                micropost = MicroPost(authorKey = user.key, 
                                      date = get_date_from_db_date(date))

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
            dateString = get_db_date_from_url_date(startKey)
            microposts = MicroPostManager.getMine(dateString)

        else:
            microposts = MicroPostManager.getMine()

        self.return_json(json_util.getJsonFromDocList(microposts))
    

# Template handlers

class NewsTHandler(NewebeAuthHandler):
    def get(self):
        self.render("../templates/news/news.html")


class NewsContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("../templates/news/news_content.html")


class NewsTutorial1THandler(NewebeAuthHandler):
    def get(self):
        self.render("../templates/news/tutorial_1.html")


class NewsTutorial2THandler(NewebeAuthHandler):
    def get(self):
        self.render("../templates/news/tutorial_2.html")

