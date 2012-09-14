import os
import logging
import mimetypes

from tornado import gen
from tornado.web import asynchronous
from tornado.httpclient import HTTPError
from tornado.escape import json_decode, json_encode
from couchdbkit.exceptions import ResourceNotFound
from PIL import Image

from newebe.profile.models import UserManager
from newebe.core.handlers import NewebeAuthHandler, NewebeHandler

from newebe.contacts.models import ContactManager
from newebe.activities.models import ActivityManager
from newebe.commons.models import CommonManager, Common
from newebe.lib import date_util
from newebe.lib.http_util import ContactClient

logger = logging.getLogger("newebe.commons")

CONTACT_PATH = 'commons/contact/'


class CommonsHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve last posted commons.

    * GET: Retrieves all commons ordered by title.
    * POST: Create a common.
    '''
    def get(self, startKey=None, tag=None):
        '''
        Returns last posted commons.  If *startKey* is provided, it returns
        last common posted until *startKey*.
        '''

        self.return_documents_since(CommonManager.get_last_commons, startKey,
                tag)

    @asynchronous
    def post(self):
        '''
        Creates a common and corresponding activity. Then common is
        propagated to all trusted contacts.

        Errors are stored inside activity.
        '''

        file = self.request.files['common'][0]

        if file:
            filebody = file["body"]
            filename = file['filename']

            common = Common(
                title="New Common",
                path=filename,
                contentType=file["content_type"],
                authorKey=UserManager.getUser().key,
                author=UserManager.getUser().name,
                isFile=True
            )
            common.save()

            common.put_attachment(filebody, filename)
            common.save()

            self.create_owner_creation_activity(
                    common, "publishes", "common")

            self.send_creation_to_contacts(CONTACT_PATH, common)

            logger.info("Common %s successfuly posted." % filename)
            self.return_json(common.toJson(), 201)

        else:
            self.return_failure("No common posted.", 400)


class CommonsMyHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve last commons posted by
    Newebe owner.

    * GET: Retrieves last commons posted by newebe owner.
    * POST: Creates a common.
    '''
    def get(self, startKey=None, tag=None):
        '''
        Returns last posted commons.
        '''
        self.return_documents_since(CommonManager.get_owner_last_commons,
                                    startKey, tag)


class CommonsQQHandler(CommonsHandler):
    '''
    This handler handles requests from QQ uploader to post new commons.

    * POST: Create a common.
    '''
    @asynchronous
    def post(self):
        '''
        Creates a common and corresponding activity. Then common is
        propagated to all trusted contacts.

        Errors are stored inside activity.
        '''

        filebody = self.request.body
        filename = self.get_argument("qqfile")
        try:
            tag = self.get_argument("tag")
        except:
            tag = "all"
        filetype = mimetypes.guess_type(filename)[0] or \
                'application/octet-stream'

        if filebody:

            common = Common(
                title="New Common",
                path=filename,
                contentType=filetype,
                authorKey=UserManager.getUser().key,
                author=UserManager.getUser().name,
                isMine=True,
                isFile=True,
                tags=[tag]
            )
            common.save()

            common.put_attachment(content=filebody, name=filename)
            common.save()

            self.create_owner_creation_activity(
                    common, "publishes", "common")

            self.send_creation_to_contacts(CONTACT_PATH, common)

            logger.info("Common %s successfuly posted." % filename)
            self.return_json(common.toJson(), 201)

        else:
            self.return_failure("No common posted.", 400)


class CommonContactHandler(NewebeHandler):
    '''
    This handler handles requests coming from contacts.

    * POST : Creates a new common.
    * PUT :  Deletes a common.
    '''

    def post(self):
        '''
        Extract common and file linked to the common from request, then
        creates a common in database for the contact who sends it. An
        activity is created too.

        If author is not inside trusted contacts, the request is rejected.
        '''

        data = self.get_body_as_dict(
            expectedFields=["title", "path", "contentType", "authorKey",
                             "author", "date"])

        if file and data:
            contact = ContactManager.getTrustedContact(
                    data.get("authorKey", ""))

            if contact:
                date = date_util.get_date_from_db_date(data.get("date", ""))

                common = CommonManager.get_contact_common(
                            contact.key, data.get("date", ""))

                if not common:
                    common = Common(
                        title=data.get("title", ""),
                        path=data.get("path", ""),
                        contentType=data.get("contentType", ""),
                        authorKey=data.get("authorKey", ""),
                        author=data.get("author", ""),
                        tags=contact.tags,
                        date=date,
                        isMine=False,
                        isFile=False
                    )
                    common.save()

                    self.create_creation_activity(contact,
                            common, "publishes", "common")

                logger.info("New common from %s" % contact.name)
                self.return_success("Creation succeeds", 201)

            else:
                self.return_failure("Author is not trusted.", 400)
        else:
            self.return_failure("No data sent.", 405)

    def put(self):
        '''
        Delete common of which data are given inside request.
        Common is found with contact key and creation date.

        If author is not inside trusted contacts, the request is rejected.
        '''

        data = self.get_body_as_dict()

        if data:
            contact = ContactManager.getTrustedContact(
                    data.get("authorKey", ""))

            if contact:
                common = CommonManager.get_contact_common(
                        contact.key, data.get("date", ""))

                if common:
                    self.create_deletion_activity(contact,
                            common, "deletes", "common")
                    common.delete()

                self.return_success("Deletion succeeds")

            else:
                self.return_failure("Author is not trusted.", 400)

        else:
            self.return_failure("No data sent.", 405)


class CommonObjectHandler(NewebeAuthHandler):

    def get(self, id):
        '''
        Retrieves common corresponding to id. Returns a 404 response if
        common is not found.
        '''
        common = CommonManager.get_common(id)
        if common:
            self.on_common_found(common, id)
        else:
            self.return_failure("Common not found.", 404)

    def on_common_found(self, common, id):
        pass


class CommonFileHandler(NewebeAuthHandler):
    '''
    Returns file linked to a given common document.
    '''

    def get(self, id, filename):
        '''
        Retrieves common corresponding to id. Returns a 404 response if
        common is not found.
        '''

        common = CommonManager.get_common(id)
        if common:
            self.filename = filename
            self.on_common_found(common, id)
        else:
            self.return_failure("Common not found.", 404)

    def on_common_found(self, common, id):
        '''
        Returns file linked to given common.
        '''
        try:
            file = common.fetch_attachment(self.filename)
            self.set_header("Content-Type", common.contentType)
            self.write(file)
            self.finish()
        except ResourceNotFound:
            self.return_failure("Common not found.", 404)


class CommonHandler(CommonObjectHandler):
    '''
    Handles operations on a single common.

    * GET : Retrieves common corresponding to id given in URL.
    * DELETE : Deletes common corresponding to id given in URL.
    '''

    def on_common_found(self, common, id):
        '''
        Retrieves common corresponding to id.
        '''
        self.return_document(common)

    @asynchronous
    def delete(self, id):
        '''
        Deletes common corresponding to id.
        '''
        common = CommonManager.get_common(id)
        if common:
            user = UserManager.getUser()

            if common.authorKey == user.key:
                self.create_owner_deletion_activity(
                        common, "deletes", "common")
                self.send_deletion_to_contacts("commons/contact/", common)

            common.delete()
            self.return_success("Common deleted.")
        else:
            self.return_failure("Common not found.", 404)


class CommonDownloadHandler(CommonObjectHandler):
    '''
    Handler that allows newebe owner to download original file of the common
    inside its newebe to make it available through UI.
    '''

    @asynchronous
    def on_common_found(self, common, id):
        '''
        '''
        self.common = common

        data = dict()
        data["common"] = common.toDict(localized=False)
        data["contact"] = UserManager.getUser().asContact().toDict()

        contact = ContactManager.getTrustedContact(common.authorKey)

        client = ContactClient()
        body = json_encode(data)

        try:
            client.post(contact,  u"commons/contact/download/",
                        body, self.on_download_finished)
        except HTTPError:
            self.return_failure("Cannot download common from contact.")

    def on_download_finished(self, response):
        logger.info(self.common)

        if response.code == 200:
            self.common.put_attachment(response.body, self.common.path)
            self.common.isFile = True
            self.common.save()
            self.return_success("Common successfuly downloaded.")
        else:
            self.return_failure("Common cannot be retrieved.")


class CommonContactDownloadHandler(NewebeHandler):

    @asynchronous
    def post(self):
        '''
        When a post request is sent, the newebe downloads full size version of
        common specified in the request from the contact also specified in
        the request.
        '''
        data = self.get_body_as_dict()

        contact = ContactManager.getTrustedContact(data["contact"]["key"])

        if contact:
            date = data["common"]["date"]

            common = CommonManager.get_owner_last_commons(date).first()

            if common:
                self.on_common_found(common, id)
            else:
                logger.info("Common no more available.")
                self.return_failure("Common not found.", 404)
        else:
            logger.info("Contact unknown")
            self.return_failure("Common not found", 404)

    @asynchronous
    def on_common_found(self, common, id):
        '''
        When common is found, a download request is sent to the contact.
        '''

        file = common.fetch_attachment(common.path)

        self.set_status(200)
        self.set_header("Content-Type", common.contentType)
        self.write(file)
        self.finish()


class CommonTHandler(CommonObjectHandler):
    '''
    This handler allows to retrieve common at HTML format.
    * GET: Return for given id the HTML representation of corresponding
           common.
    '''

    def on_common_found(self, common, id):
        '''
        Returns for given id the HTML representation of corresponding
        common.
        '''
        common.date = date_util.convert_utc_date_to_timezone(common.date)
        if common.isFile:
            self.render("templates/common.html", common=common)
        else:
            self.render("templates/common_empty.html", common=common)


class CommonRetryHandler(NewebeAuthHandler):

    @asynchronous
    def post(self, key):
        '''
        Resend post with *key* as key to the contact given in the posted
        JSON. Corresponding activity ID is given inside the posted json.
        Here is the format : {"contactId":"data","activityId":"data"}
        '''
        common = CommonManager.get_common(key)
        idInfos = self.request.body

        ids = json_decode(idInfos)

        if common and idInfos:

            contactId = ids["contactId"]
            activityId = ids["activityId"]

            contact = ContactManager.getTrustedContact(contactId)
            activity = ActivityManager.get_activity(activityId)

            if not contact:
                self.return_failure("Contact not found", 404)
            elif not activity:
                self.return_failure("Activity not found", 404)
            else:
                info = "Attemp to resend a common to contact: {}."
                logger.info(info.format(contact.name))
                self.forward_to_contact(common, contact, activity)
        else:
            self.return_failure("Common not found", 404)

    @asynchronous
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
                common = Common(
                    authorKey=user.key,
                    date=date_util.get_date_from_db_date(date)
                )

                info = "Attemp to resend a common deletion to contact: {}."
                logger.info(info.format(contact.name))

                self.forward_to_contact(common, contact, activity,
                                        method="PUT")

        else:
            self.return_failure("Micropost not found", 404)

    @asynchronous
    @gen.engine
    def forward_to_contact(self, common, contact, activity, method="POST"):
        '''
        *common is sent to *contact* via a request of which method is set
        as *method*. If request succeeds, error linked to this contact
        is removed. Else nothing is done and error code is returned.
        '''

        client = ContactClient()
        body = common.toJson()

        try:
            if method == "POST":
                client.post(contact, CONTACT_PATH, body,
                            callback=(yield gen.Callback("retry")))
                response = yield gen.Wait("retry")
            else:
                body = common.toJson(localized=False)
                response = client.put(contact, CONTACT_PATH, body,
                                      callback=(yield gen.Callback("retry")))
                response = yield gen.Wait("retry")

            if response.error:
                message = "Retry common request to a contact failed ({})."
                self.return_failure(message.format(method))

            else:
                for error in activity.errors:
                    if error["contactKey"] == contact.key:
                        activity.errors.remove(error)
                        activity.save()
                        self.return_success("Common request correctly resent.")

        except:
            self.return_failure("Common resend to a contact failed again.")


class CommonRowsTHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve last posted commons.

    * GET: Retrieves all commons ordered by title.
    * POST: Create a common.
    '''

    def get(self, startKey=None):
        '''
        Returns last posted commons.  If *startKey* is provided, it returns
        last common posted until *startKey*.
        '''

        get_doc = CommonManager.get_last_commons
        if startKey:
            dateString = date_util.get_db_utc_date_from_url_date(startKey)
            docs = get_doc(dateString)
        else:
            docs = get_doc()

        self.render("templates/common_rows.html", commons=docs)


# Template handlers

class CommonsTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/commons.html",
                    isTheme=self.is_file_theme_exists())


class CommonsContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/commons_content.html")
