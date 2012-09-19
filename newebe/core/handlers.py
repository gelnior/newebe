import logging
import hashlib
import os
import mimetypes


from tornado.escape import json_decode, json_encode
from tornado.web import RequestHandler, asynchronous
from tornado.httpclient import HTTPError


from newebe.lib import json_util, date_util
from newebe.lib.http_util import ContactClient

from newebe.apps.profile.models import UserManager
from newebe.apps.contacts.models import ContactManager
from newebe.apps.activities.models import Activity

logger = logging.getLogger("newebe.core")


class NewebeHandler(RequestHandler):
    '''
    NewebeHandler is a base class to provide utility methods for handlers used
    by the newebe application.
    '''

    def return_json(self, json, statusCode=200):
        '''
        Return a response containing json (content-type already set).
        '''

        self.set_status(statusCode)
        self.set_header("Content-Type", "application/json")
        self.write(json)
        self.finish()

    def return_list(self, valueList, statusCode=200):
        '''
        Return a response containing a list of values at json format.
        '''

        self.return_json({"rows": valueList, "total_rows": len(valueList)})

    def return_documents(self, documents, statusCode=200):
        '''
        Return a response containing a list of newebe documents at json format.
        '''

        self.return_json(
                json_util.get_json_from_doc_list(documents), statusCode)

    def return_document(self, document, statusCode=200):
        '''
        Return a response containing a list of newebe documents at json format.
        '''

        self.return_json(json_util.get_json_from_doc_list([document]),
                                                          statusCode)

    def return_one_document(self, document, statusCode=200):
        '''
        Return document at JSON format.
        '''

        self.return_json(document.toJson(), statusCode)

    def return_one_document_or_404(self, document, text):
        '''
        Return *document*. If *document* is null, a 404 response is returned
        and it logs given *text*.
        '''

        if document:
            self.return_json(document.toJson())
        else:
            self.return_failure(text, 404)

    def return_documents_since(self, get_doc, startKey, tag=None):
        '''
        Use the get doc function that takes a date converted from startKey
        (startKey must be an url date or null) as parameter to send
        desired documents to client.

        Return documents by pack at JSON format. If a start key
        is given in URL (it means a date like 2010-10-05-12-30-48),
        documents until this date are returned. Else latest documents are
        returned.
        '''

        if startKey:
            dateString = date_util.get_db_utc_date_from_url_date(startKey)
            docs = get_doc(startKey=dateString, tag=tag)
        else:
            docs = get_doc()

        self.return_documents(docs)

    def return_success(self, text, statusCode=200):
        '''
        Return a success response containing a JSON object that describes
        the success.
        '''

        logger.info(text)
        self.return_json(json_encode({"success": text}), statusCode)

    def return_failure(self, text, statusCode=500):
        '''
        Return an error response containing a JSON object that describes
        the error.
        '''

        logger.error(text)
        self.return_json(json_encode({"error": text}), statusCode)

    def return_file(self, fileName, fileContent):
        '''
        Return given file and set content type automatically by guessing it
        from its extension.
        '''

        filetype = mimetypes.guess_type(fileName)[0] or \
                    'application/octet-stream'
        self.set_header("Content-Type", filetype)
        self.write(fileContent)
        self.finish()

    def get_document(self, get_doc, id):
        doc = get_doc(id)

        if doc:
            return doc
        else:
            self.return_failure("Not found", 404)

    def get_body_as_dict(self, expectedFields=[]):
        '''
        Return request body as a dict if body is written in JSON. Else None
        is returned.
        Return None if one given field is missing in the parsed dict.
        '''

        data = self.request.body
        if data:
            dataDict = json_decode(data)

            for field in expectedFields:
                if field not in dataDict:
                    return None

            return dataDict
        else:
            return None

    def get_json_from_response(self, response):
        '''
        Extracts json from response and convert it as a dict.
        '''

        data = response.body
        if data:
            dataDict = json_decode(data)
            return dataDict
        else:
            return None

    def create_owner_creation_activity(self, doc, verb, docType):
        '''
        Creates a new activity corresponding to a document creation
        made by Newebe owner.

        * doc: The created document.
        * verb: verb linked to this activity.
        * docType: Type of the created document.
        '''

        self.create_creation_activity(
            UserManager.getUser().asContact(), doc, verb, docType, True)

    def create_creation_activity(self, contact, doc, verb, docType,
                                 isMine=False):
        '''
        Creates a new activity corresponding to a document creation.

        * contact: contact that made the creation.
        * doc: The created document.
        * verb: verb linked to this activity.
        * docType: Type of the created document.
        * isMine : True if activity is made by owner.
        '''

        self.activity = Activity(
            authorKey=contact.key,
            author=contact.name,
            verb=verb,
            docType=docType,
            docId=doc._id,
            isMine=isMine,
            method="POST"
        )
        self.activity.save()

    def create_owner_deletion_activity(self, doc, verb, docType):
        '''
        Creates a new activity corresponding to a document deletion made
        by owner.

        * doc: The deleted document.
        * verb: verb linked to this activity.
        * docType: Type of the deleted document.
        '''

        self.create_deletion_activity(
            UserManager.getUser().asContact(), doc, verb, docType, True)

    def create_deletion_activity(self, contact, doc, verb, docType,
                                 isMine=False):
        '''
        Creates a new activity corresponding to a document deletion.

        * contact: contact that made the deletion.
        * doc: The deleted document.
        * verb: verb linked to this activity.
        * docType: Type of the deleted document.
        * isMine: True if deletion is done by owner.
        '''

        self.activity = Activity(
            authorKey=contact.key,
            author=contact.name,
            verb=verb,
            docType=docType,
            docId=doc._id,
            method="DELETE",
            isMine=isMine
        )
        self.activity.save()

    def create_modify_activity(self, contact, verb, docType, doc=None):
        '''
        Creates an activity that describes a contact profile modification.
        '''

        if doc:
            docId = doc._id
        else:
            docId = "none"

        activity = Activity(
             authorKey=contact.key,
             author=contact.name,
             verb=verb,
             docType=docType,
             method="PUT",
             docId=docId,
             isMine=False
        )
        activity.save()

    @asynchronous
    def send_creation_to_contacts(self, path, doc):
        '''
        Sends a POST request to all trusted contacts.

        Request body contains object to post at JSON format.
        '''

        tag = None
        if doc.tags:
            tag = doc.tags[0]
        contacts = ContactManager.getTrustedContacts(tag=tag)
        client = ContactClient(self.activity)
        for contact in contacts:
            try:
                client.post(contact, path, doc.toJson(localized=False))
            except HTTPError:
                self.activity.add_error(contact)
                self.activity.save()

    @asynchronous
    def send_files_to_contacts(self, path, fields, files, tag=None):
        '''
        Sends in a form given file and fields to all trusted contacts (at given
        path).

        If any error occurs, it is stored in linked activity.
        '''

        contacts = ContactManager.getTrustedContacts(tag=tag)
        client = ContactClient(self.activity)
        for contact in contacts:
            try:
                client.post_files(contact, path, fields=fields, files=files)
            except HTTPError:
                self.activity.add_error(contact)
                self.activity.save()

    @asynchronous
    def send_deletion_to_contacts(self, path, doc):
        '''
        Send a delete request (PUT because Tornado don't handle DELETE request
        with a body) to all trusted contacts.

        Request body contains object to delete at JSON format.
        '''

        contacts = ContactManager.getTrustedContacts()
        client = ContactClient(self.activity)
        date = date_util.get_db_date_from_date(doc.date)

        for contact in contacts:
            try:
                client.delete(contact, path, doc.toJson(localized=False), date)
            except HTTPError:
                import pdb
                pdb.set_trace()
                self.activity.add_error(contact, extra=date)
                self.activity.save()

    def is_file_theme_exists(self):
        '''
        True if theme.css exists in CSS static folder. This stylesheet is
        optional. So, for templates, it is useful to know if it exists.
        '''

        return os.path.isfile(os.path.join("static", "css", "theme.css"))


class NewebeAuthHandler(NewebeHandler):
    '''
    Base handler for every services that needs authentication.
    For each request to this kind of handler, if user
    is not logged in, it is directly redirected to login page. If no user
    exists, it is redirected to register page.
    '''

    def prepare(self):
        '''
        Simple turn around to finish the request if user is not authenticated.
        '''

        user = self.current_user
        if not user:
            self._finished = True

    def get_current_user(self):
        '''
        With tornado, authentication is handled in this method.
        '''

        user = UserManager.getUser()

        if user:

            if user.password is None:
                logger.error("User has no password registered")
                self.redirect("/register/password/")

            else:
                password = self.get_secure_cookie("password")

                if not password or  \
                   user.password != hashlib.sha224(password).hexdigest():
                    logger.error("User is not authenticated")
                    self.redirect("/login/")

                else:
                    return user

        else:
            logger.error("User is not authenticated")
            self.redirect("/register/")
