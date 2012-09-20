import datetime
import logging
##import markdown

from tornado.web import asynchronous
from tornado.escape import json_decode

from newebe.lib.slugify import slugify
from newebe.lib.http_util import ContactClient

from newebe.apps.profile.models import UserManager
from newebe.apps.contacts.models import Contact, ContactManager, \
                               STATE_WAIT_APPROVAL, STATE_ERROR, \
                               STATE_TRUSTED, STATE_PENDING
from newebe.apps.core.handlers import NewebeAuthHandler, NewebeHandler


# Template handlers for contact pages.
logger = logging.getLogger(__name__)


class ContactUpdateHandler(NewebeHandler):

    def put(self):
        '''
        When a put request is received, contact data are expected. If contact
        key is one of the trusted contact key, its data are updated with
        received ones.
        '''

        data = self.get_body_as_dict(["key", "url", "name", "description"])

        if data:
            key = data["key"]

            contact = ContactManager.getTrustedContact(key)
            if contact:
                contact.url = data["url"]
                contact.description = data["description"]
                contact.name = data["name"]
                contact.save()

                self.create_modify_activity(contact, "modifies", "profile")
                self.return_success("Contact successfully modified.")

            else:
                self.return_failure(
                        "No contact found corresponding to given contact", 404)

        else:
            self.return_failure("Empty data or missing field.")


class ContactsPendingHandler(NewebeAuthHandler):
    '''
     * GET : retrieve only contacts that have not approved your contact
              request or  contacts that returned an error.
    '''

    def get(self):
        '''
        Retrieve whole contact list at JSON format.
        '''

        contacts = ContactManager.getPendingContacts()

        self.return_documents(contacts)


class ContactsRequestedHandler(NewebeAuthHandler):
    '''
     * GET : contacts that wait for approval.
    '''

    def get(self):
        '''
        Retrieve whole contact list at JSON format.
        '''

        contacts = ContactManager.getRequestedContacts()

        self.return_documents(contacts)


class ContactsTrustedHandler(NewebeAuthHandler):
    '''
     * GET : retrieve only contacts that are trusted by newebe owner
    '''

    def get(self):
        '''
        Retrieve whole contact list at JSON format.
        '''

        contacts = ContactManager.getTrustedContacts()

        self.return_documents(contacts)


class ContactHandler(NewebeAuthHandler):
    '''
    Resource to manage specific contacts.
    GET: Gets a contact for a given slug.
    PUT: Confirm contact request.
    DELETE: Deletes contact corresponding to given slug.
    '''

    def get(self, slug):
        '''
        Retrieves contact corresponding to slug at JSON format.
        '''

        contact = ContactManager.getContact(slug)

        self.return_one_document_or_404(contact, "Contact does not exist.")

    @asynchronous
    def put(self, slug):
        '''
        Confirm contact request.
        '''

        self.contact = ContactManager.getContact(slug)
        if self.contact:
            self.contact.state = STATE_TRUSTED
            self.contact.save()

            user = UserManager.getUser()
            data = user.asContact().toJson(localized=False)

            try:
                client = ContactClient()
                client.post(self.contact, "contacts/confirm/", data,
                            self.on_contact_response)
            except:
                self.contact.state = STATE_ERROR
                self.contact.save()
                self.return_failure("Error occurs while confirming contact.")
        else:
            self.return_failure("Contact to confirm does not exist.")

    def on_contact_response(self, response, **kwargs):
        '''
        Check contact response and set contact status depending on this
        response.
        '''

        try:
            incomingData = response.body
            newebeResponse = json_decode(incomingData)
            if not newebeResponse["success"]:
                raise Exception()

            self.return_success("Contact trusted.")
        except:
            self.contact.state = STATE_ERROR
            self.contact.save()
            self.return_failure("Error occurs while confirming contact.")

    def delete(self, slug):
        '''
        Deletes contact corresponding to slug.
        '''

        contact = ContactManager.getContact(slug)
        if contact:
            contact.delete()
            return self.return_success("Contact has been deleted.")
        else:
            self.return_failure("Contact does not exist.")


class ContactsHandler(NewebeAuthHandler):
    '''
    This is the resource for contact data management. It allows :
     * GET : retrieves all contacts data.
     * POST : creates a new contact.
    '''

    def get(self):
        '''
        Retrieves whole contact list at JSON format.
        '''
        contacts = ContactManager.getContacts()

        self.return_documents(contacts)

    @asynchronous
    def post(self):
        '''
        Creates a new contact from web client data
        (contact object at JSON format). And send a contact request to the
        newly created contact. State of contact is set to PENDING.
        '''

        logger = logging.getLogger("newebe.contact")

        data = self.get_body_as_dict(["url"])

        if data:
            url = data["url"]
            owner = UserManager.getUser()

            if owner.url != url:
                slug = slugify(url)

                self.contact = Contact(
                  url=url,
                  slug=slug
                )
                self.contact.save()

                try:
                    data = UserManager.getUser().asContact().toJson()

                    client = ContactClient()
                    client.post(self.contact, "contacts/request/",
                                data, self.on_contact_response)

                except Exception:
                    import traceback
                    logger.error("Error on adding contact:\n %s" %
                            traceback.format_exc())

                    self.contact.state = STATE_ERROR
                    self.contact.save()

                return self.return_one_document(self.contact, 201)

            else:
                return self.return_failure(
                        "Wrong data. Url is same as owner URL.", 400)
        else:
            return self.return_failure(
                    "Wrong data. Contact has not been created.", 400)

    def on_contact_response(self, response, **kwargs):
        '''
        On contact response, checks if no error occured. If error occured,
        it changes the contact status from Pending to Error.
        '''

        try:
            newebeResponse = json_decode(response.body)
            print newebeResponse
            if not "success" in newebeResponse or \
               not newebeResponse["success"]:
                self.contact.state = STATE_ERROR
                self.contact.save()

        except:
            import traceback
            logger.error("Error on adding contact, stacktrace :\n %s" %
                    traceback.format_exc())

            self.contact.state = STATE_ERROR
            self.contact.save()


class ContactRetryHandler(NewebeAuthHandler):
    '''
    This handler allows to resend contact request to a contact that have
    already received contact request.
    * POST: Send a new contact request to given contact if its state is
    set as Pending or Error.
    '''

    @asynchronous
    def post(self, slug):
        '''
        When post request is received, contact of which slug is equal to
        slug is retrieved. If its state is Pending or Error, the contact
        request is send again.
        '''

        logger = logging.getLogger("newebe.contact")

        self.contact = ContactManager.getContact(slug)
        owner = UserManager.getUser()

        if self.contact and self.contact.url != owner.url:
            try:
                data = owner.asContact().toJson()

                client = ContactClient()
                client.post(self.contact, "contacts/request/", data,
                            self.on_contact_response)

            except Exception:
                import traceback
                logger.error("Error on adding contact:\n %s" %
                        traceback.format_exc())

                self.contact.state = STATE_ERROR
                self.contact.save()

            self.return_one_document(self.contact)
        else:
            self.return_failure("Contact does not exist", 404)

    def on_contact_response(self, response, **kwargs):

        if response.code != 200:
            self.contact.state = STATE_ERROR
            self.contact.save()

        else:
            self.contact.state = STATE_PENDING
            self.contact.save()


class ContactPushHandler(NewebeHandler):
    '''
    This is the resource for contact request. It allows :
     * POST : asks for a contact authorization.
    '''

    def post(self):
        '''
        Create a new contact from sent data (contact object at JSON format).
        Sets its status to Wait For Approval
        '''
        data = self.get_body_as_dict(expectedFields=["url"])

        if data:
            url = data["url"]
            owner = UserManager.getUser()

            if owner.url != url:
                slug = slugify(url)

                contact = ContactManager.getContact(slug)
                owner = UserManager.getUser()

                if contact is None:
                    contact = Contact(
                        name=data["name"],
                        url=url,
                        slug=slug,
                        key=data["key"],
                        state=STATE_WAIT_APPROVAL,
                        requestDate=datetime.datetime.utcnow(),
                        description=data["description"]
                    )
                    contact.save()

                contact.state = STATE_WAIT_APPROVAL
                contact.save()

                self.return_success("Request received.")

            else:
                self.return_failure("Contact and owner have same url.")

        else:
            self.return_failure("Sent data are incorrects.")


class ContactConfirmHandler(NewebeHandler):
    '''
    This is the resource for contact confirmation. It allows :
     * POST : confirm a contact and set its state to TRUSTED.
    '''

    def post(self):
        '''
        Updates contact from sent data (contact object at JSON format).
        Sets its status to Trusted.
        '''
        data = self.get_body_as_dict(expectedFields=["url", "key", "name"])

        if data:
            url = data["url"]
            slug = slugify(url)

            contact = ContactManager.getContact(slug)

            if contact:
                contact.state = STATE_TRUSTED
                contact.key = data["key"]
                contact.name = data["name"]
                contact.save()
                self.return_success("Contact trusted.")

            else:
                self.return_failure("No contact for this slug.", 400)

        else:
            self.return_failure("Sent data are incorrects.", 400)


class ContactRenderTHandler(NewebeAuthHandler):
    '''
    * GET: returns an HTML representation of contact corresponding to given
    ID. If ID is equal to null Newebe owner representation is returned.
    '''

    def get(self, key):
        '''
        Returns an HTML representation of contact corresponding to given
        ID. If ID is equal to null Newebe owner representation is returned.
        '''

        if key == "null" or key == UserManager.getUser().key:
            contact = UserManager.getUser().asContact()
        else:
            contact = ContactManager.getTrustedContact(key)

        if contact:
            #if contact.description:
            #    contact.description = markdown.markdown(contact.description)

            self.render("templates/contact_render.html",
                            contact=contact)
        else:
            return self.return_failure("Contact not found.", 404)


class ContactTagsHandler(NewebeAuthHandler):
    '''
    Return the list of tags set on owner contacts.
    '''

    def get(self):
        '''
        Return the list of tags set on owner contacts.
        '''

        tags = ContactManager.getTags()
        if "all" not in tags:
            tags.append("all")
        self.return_list(tags)


class ContactTagHandler(NewebeAuthHandler):
    '''
    Return the list of tags set on owner contacts.
    '''

    def put(self, slug):
        '''
        Grab tags sent inside request to set is on contact matching slug.
        '''

        contact = ContactManager.getContact(slug)
        data = self.get_body_as_dict(["tags"])

        if contact:
            if data:
                contact.tags = data["tags"]
                contact.save()
            else:
                self.return_failure("No tags were sent")
        else:
            self.return_failure("Contact to modify does not exist.", 404)


# Template handlers.
class ContactContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/contact_content.html")


class ContactTutorial1THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/tutorial_1.html")


class ContactTutorial2THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/tutorial_2.html")


class ContactTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/contact.html",
                    isTheme=self.is_file_theme_exists())
