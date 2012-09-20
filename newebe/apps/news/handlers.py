import logging
import markdown

from tornado import gen
from tornado.web import asynchronous
from tornado.escape import json_encode
from couchdbkit.exceptions import ResourceNotFound

from newebe.lib import date_util, indexer
from newebe.lib.http_util import ContactClient
from newebe.apps.news.models import MicroPostManager, MicroPost
from newebe.apps.activities.models import ActivityManager
from newebe.apps.contacts.models import ContactManager
from newebe.apps.profile.models import UserManager
from newebe.apps.core.handlers import NewebeHandler, NewebeAuthHandler
from newebe.apps.core.attach import Converter

logger = logging.getLogger("newebe.news")

# When a new post is created, it is forwarded to contacts via POST requests.
# CONTACT_PATH is the end of the URI where data are sent. Full URI is
# (contact URI + CONTACT_PATH).
CONTACT_PATH = 'microposts/contacts/'

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
    * GET request returns post corresponding to the id given in the request
    URL.
    * DELETE request deletes post corresponding to the id given in the request
    URL. Then send the delete request to contacts.
    '''

    def get(self, postId):
        '''
        GET request returns post corresponding to the id given in the request
        URL.
        '''

        micropost = MicroPostManager.get_micropost(postId)
        self.return_one_document_or_404(micropost, "No post found")

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
            postIndexer = indexer.Indexer()
            postIndexer.remove_doc(micropost)
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
    def get(self, startKey=None, tag=None):
        '''
        Return microposts by pack of NEWS_LIMIT at JSON format. If a start key
        is given in URL (it means a date like 2010-10-05-12-30-48),
        microposts from this date are returned. Else latest news are returned.

        Arguments:
            *startKey* The date from where news should be returned.
        '''

        self.return_documents_since(MicroPostManager.get_list, startKey, tag)

    @asynchronous
    def post(self):
        '''
        When post request is received, micropost data are expected as
        a JSON object. It is extracted from it
        then stored inside a new Microposts object. Micropost author is
        automatically set with current user and current date is set as date.

        Created microposts are forwarded to contacts.
        '''

        logger.info("Micropost post received.")

        data = self.get_body_as_dict(expectedFields=["content", "tags"])

        if data and data["content"]:
            user = UserManager.getUser()
            converter = Converter()
            micropost = MicroPost(
                authorKey=user.key,
                author=user.name,
                content=data['content'],
                attachments=converter.convert(data),
                tags=data["tags"]
            )
            micropost.save()
            converter.add_files(micropost)

            self.create_owner_creation_activity(micropost,
                                                "writes", "micropost")
            self.send_creation_to_contacts(CONTACT_PATH, micropost)
            postIndexer = indexer.Indexer()
            postIndexer.index_micropost(micropost)

            logger.info("Micropost successfuly posted.")
            self.return_json(micropost.toJson())

        else:
            self.return_failure(
                    "Sent data were incorrects. No post was created.", 400)


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

        data = self.get_body_as_dict(expectedFields=["date", "authorKey"])

        if data:
            db_date = data.get("date")
            date = date_util.get_date_from_db_date(db_date)
            authorKey = data.get("authorKey")

            contact = ContactManager.getTrustedContact(authorKey)
            micropost = MicroPostManager.get_contact_micropost(
                             authorKey, db_date)

            if contact:
                if not micropost:
                    micropost = MicroPost(
                        authorKey=authorKey,
                        author=data["author"],
                        content=data['content'],
                        date=date,
                        attachments=data.get("attachments", []),
                        isMine=False,
                        tags=contact.tags
                    )
                    micropost.save()

                    self.create_creation_activity(contact, micropost,
                            "writes", "micropost")
                    self._write_create_log(micropost)

                    postIndexer = indexer.Indexer()
                    postIndexer.index_micropost(micropost)
                    self._notify_suscribers(micropost)

                self.return_json(micropost.toJson(), 201)

            else:
                self.return_failure("Contact is not registered.", 405)

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

        logger.info("Micropost from %s received" % micropost.author)

    def put(self):
        '''
        When a delete request from a contact is incoming, it executes the
        delete request locally then it creates a new activity corresponding
        to this deletion.
        '''

        data = self.get_body_as_dict(expectedFields=["date", "authorKey"])

        if data:
            authorKey = data["authorKey"]
            date = data["date"]

            micropost = MicroPostManager.get_contact_micropost(authorKey, date)
            contact = ContactManager.getTrustedContact(authorKey)

            if micropost and contact:
                self.create_deletion_activity(contact, micropost, "deletes",
                        "micropost")
                postIndexer = indexer.Indexer()
                postIndexer.remove_doc(micropost)
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


class MicropostAttachedFileHandler(NewebeAuthHandler):

    def get(self, postId, fileName):
        '''
        Return file which corresponds to *filename* and which is attached to
        micropost of which ID is equal to postId.
        '''

        micropost = MicroPostManager.get_micropost(postId)
        if micropost:
            try:
                fileContent = micropost.fetch_attachment(fileName)
                self.return_file(fileName, fileContent)
            except ResourceNotFound:
                self.return_failure("File not found", 404)
        else:
            self.return_failure("Micropost not found.", 404)


class MicropostDlAttachedFileHandler(NewebeAuthHandler):
    '''
    To not overload bandwidht, post attached file are downloaded on request.
    This resource allows user to download files attached to micropost
    which missed.
    '''

    @asynchronous
    @gen.engine
    def post(self, postId):
        '''
        Grab from contact the file corresponding to given path and given post
        (post of which ID is equal to *postId*).
        '''

        data = self.get_body_as_dict(expectedFields=["path"])

        micropost = MicroPostManager.get_micropost(postId)
        contact = ContactManager.getTrustedContact(micropost.authorKey)
        user = UserManager.getUser()
        if micropost and data and contact:
            path = data["path"]
            client = ContactClient()
            body = {
                "date": date_util.get_db_date_from_date(micropost.date),
                "contactKey": user.key,
                "path": path
            }

            client.post(contact, "microposts/contacts/attach/",
                        json_encode(body),
                        callback=(yield gen.Callback("getattach")))
            response = yield gen.Wait("getattach")

            if response.error:
                self.return_failure(
                        "An error occured while retrieving picture.")
            else:
                micropost.put_attachment(response.body, data["path"])
                self.return_success("Download succeeds.")

        else:
            if not data:
                self.return_failure("Wrong data.", 400)
            elif not contact:
                self.return_failure("Contact no more available.", 400)
            else:
                self.return_failure("Micropost not found.", 404)


class MicropostContactAttachedFileHandler(NewebeHandler):
    '''
    Handlers to allow other contacts to download file attached to a given
    micropost.
    '''

    def post(self):
        '''
        Returns file which is attached to post corresponding to a given
        date (we assumed a user can't post two posts at the same time).
        Expected data :
        * path : file name
        * date : date on which post was posted
        * contactKey : the key of the contact which claims the file.
        '''

        data = self.get_body_as_dict(expectedFields=["path", "date",
            "contactKey"])

        if data:
            contact = ContactManager.getTrustedContact(data["contactKey"])
            micropost = MicroPostManager.get_first(data["date"])

            if micropost and contact:
                try:
                    fileContent = micropost.fetch_attachment(data["path"])
                    self.return_file(data["path"], fileContent)
                except ResourceNotFound:
                    self.return_failure("File not found", 404)
            else:
                self.return_failure("Micropost not found.", 404)
        else:
            self.return_failure("Wrong data.", 400)


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
            self.return_failure("Micropost not found.", 404)


class NewsRetryHandler(NewebeAuthHandler):

    @asynchronous
    def post(self, key):
        '''
        Resend post with *key* as key to the contact given in the posted
        JSON. Corresponding activity ID is given inside the posted json.
        Here is the format : {"contactId":"data","activityId":"data"}
        '''

        micropost = MicroPostManager.get_micropost(key)

        data = self.get_body_as_dict(expectedFields=["contactId",
                                                     "activityId"])

        if micropost and data:

            contactId = data["contactId"]
            activityId = data["activityId"]

            contact = ContactManager.getTrustedContact(contactId)
            activity = ActivityManager.get_activity(activityId)

            if not contact:
                self.return_failure("Contact not found", 404)
            elif not activity:
                self.return_failure("Activity not found", 404)
            else:
                if contact.name:
                    info_str = "Attempt to resend a post to contact: %s."
                    logger.info(info_str % contact.name)
                self.forward_to_contact(micropost, contact, activity)
        else:
            self.return_failure("Micropost not found", 404)

    @asynchronous
    @gen.engine
    def forward_to_contact(self, micropost, contact, activity, method="POST"):
        '''
        *micropost* is sent to *contact* via a request of which method is set
        as *method*. If request succeeds, error linked to this contact
        is removed. Else nothing is done and error code is returned.
        '''

        httpClient = ContactClient()
        body = micropost.toJson(localized=False)

        try:
            httpClient.post(contact, CONTACT_PATH, body,
                            callback=(yield gen.Callback("retry")))
            response = yield gen.Wait("retry")

            if response.error:
                self.return_failure("Posting micropost to contact failed.")

            else:
                for error in activity.errors:
                    if error["contactKey"] == contact.key:
                        activity.errors.remove(error)
                        activity.save()
                        self.return_success("Micropost correctly resent.")
                # TODO: handle case where error is not found.

        except:
            self.return_failure("Posting micropost to contact failed.")

    @asynchronous
    @gen.engine
    def put(self, key):
        '''
        Resend deletion of micropost with *key* as key to the contact given in
        the posted JSON. Corresponding activity ID is given inside the posted
        json.
        Here is the format : {"contactId":"data","activityId":"data"}
        '''

        data = self.get_body_as_dict(
                expectedFields=["contactId", "activityId", "extra"])

        if data:

            contactId = data["contactId"]
            activityId = data["activityId"]
            date = data["extra"]

            contact = ContactManager.getTrustedContact(contactId)
            activity = ActivityManager.get_activity(activityId)

            if not contact:
                self.return_failure("Contact not found", 404)
            elif not activity:
                self.return_failure("Activity not found", 404)
            else:

                user = UserManager.getUser()
                micropost = MicroPost(
                    authorKey=user.key,
                    date=date_util.get_date_from_db_date(date)
                )

                logger.info(
                    "Attempt to resend a post deletion to contact: {}.".format(
                        contact.name))
                httpClient = ContactClient()
                body = micropost.toJson(localized=False)

                try:
                    httpClient.put(contact, CONTACT_PATH, body,
                                   callback=(yield gen.Callback("retry")))
                    response = yield gen.Wait("retry")

                    if response.error:
                        self.return_failure(
                                "Deleting micropost to contact failed.")

                    else:
                        for error in activity.errors:
                            if error["contactKey"] == contact.key:
                                activity.errors.remove(error)
                                activity.save()
                                self.return_success(
                                        "Micropost correctly redeleted.")

                except:
                    self.return_failure("Deleting micropost to contact failed.")

        else:
            self.return_failure("Micropost not found", 404)


class MyNewsHandler(NewebeAuthHandler):
    '''
    This handler handles request that retrieve lists of news published by
    Newebe owner.
    GET : Retrieve last 10 microposts published before a given date by owner.
    '''

    def get(self, startKey=None, tag=None):
        '''
        Return microposts by pack of NEWS_LIMIT at JSON format. If a start key
        is given in URL (it means a date like 2010-10-05-12-30-48),
        microposts from this date are returned. Else latest news are returned.
        Only microposts published by Newebe owner are returned.

        Arguments:
            *startKey* The date from where news should be returned.
        '''

        self.return_documents_since(MicroPostManager.get_mine, startKey, tag)


class NewsSearchHandler(NewebeAuthHandler):
    """
    Handler that allows user to search through its microposts.
    """

    def post(self):
        '''
        Expect query in sent JSON. Process search for this query then
        send results as response.
        '''

        data = self.get_body_as_dict(expectedFields=["query"])
        if data:
            postIndexer = indexer.Indexer()
            ids = postIndexer.search_microposts(data["query"])
            posts = MicroPostManager.get_microposts(ids)
            self.return_documents(posts)
        else:
            self.return_failure("No query given", 400)


# Template handlers

class NewsTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/news.html", isTheme=self.is_file_theme_exists())


class NewsContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/news_content.html")


class NewsTutorial1THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/tutorial_1.html")


class NewsTutorial2THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/tutorial_2.html")
