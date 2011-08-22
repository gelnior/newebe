import datetime
import logging
import hashlib
import markdown

from threading import Timer

from tornado.escape import json_decode, json_encode
from tornado.web import RequestHandler
from tornado.httpclient import HTTPClient, HTTPRequest

from newebe.lib.slugify import slugify

from newebe.lib import json_util
from newebe.core.models import UserManager
from newebe.core.models import Contact, ContactManager, \
                               STATE_WAIT_APPROVAL, STATE_ERROR, \
                               STATE_TRUSTED
from newebe.activities.models import Activity


logger = logging.getLogger("newebe.core")


class NewebeHandler(RequestHandler):
    '''
    NewebeHandler is a base class to provide utility methods for handlers used 
    by the newebe application.
    '''


    def return_json(self, json, statusCode=200):
        '''
        Return a response containig json (content-type already set).
        '''

        self.set_status(statusCode)
        self.set_header("Content-Type", "application/json")
        self.write(json)
        self.finish()


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


    def return_success(self, text, statusCode=200):
        '''
        Return a success response containing a JSON object that describes
        the success.
        '''

        self.return_json(json_encode({ "success" : text }), statusCode)
 

    def return_failure(self, text, statusCode=500):
        '''
        Return an error response containing a JSON object that describes
        the error.
        '''
        
        self.return_json(json_encode({ "error" : text }), statusCode)


    def get_body_as_dict(self):
        '''
        Return request body as a dict if body is written in JSON. Else None
        is returned.
        '''

        data = self.request.body
        if data:
            dataDict = json_decode(data)
            return dataDict
        else:
            return None

    def get_json_from_response(self, response):

        data = response.body
        if data:
            dataDict = json_decode(data)
            return dataDict
        else:
            return None




class NewebeAuthHandler(NewebeHandler):
    '''
    Base handler for every services that needs authentication. 
    For each request to this kind of handler, if user 
    is not logged in, it is directly redirected to login page. If no user
    exists, it is redirected to register page.
    '''


    def get_current_user(self):
        '''
        With tornado, authentication is handled in this method.
        '''

        user = UserManager.getUser()

        if user:
            if user.password is None:
                self.redirect("/register/password/")

            else:
                password = self.get_secure_cookie("password")

                if not password or  \
                   user.password != hashlib.sha224(password).hexdigest():
                    self.redirect("/login/")
                else:
                    return user
        else:
            self.redirect("/register/")


class ProfileUpdater:
    '''
    Utility class to handle profile forwarding to contacts. Set error
    log inside acitivity when error occurs.
    '''

    sending_data = False
    contact_requests = {}


    def send_profile_to_contacts(self):
        '''
        External methods to not send too much times the changed profile. 
        A timer is set to wait for other modifications before running this
        function that sends modification requests to every contacts.
        '''

        client = HTTPClient()
        self.sending_data = False

        user = UserManager.getUser()
        jsonbody = user.toJson()

        activity = Activity(
            authorKey = user.key,
            author = user.name,
            verb = "modifies",
            docType = "profile",
            method = "PUT",
            docId = "none",
            isMine = True
        )
        self.activity.save()     

        for contact in ContactManager.getTrustedContacts():
            request = HTTPRequest("%scontacts/update-profile/" % contact.url, 
                         method="PUT", body=jsonbody)

            response = client.fetch(request)

            if response.error:
                logger.error("""
                    Profile sending to a contact failed, error infos are 
                    stored inside activity.
                """)
                activity.add_error(contact)
                activity.save()    
            logger.info("Profile update successfully sent.")


    def forward_profile(self):
        '''
        Because profile modification occurs a lot in a short time. The 
        profile is forwarded only every ten minutes. It avoids to create
        too much activities for this profile modification.
        '''
        t = Timer(1.0 * 60 * 10, self.send_profile_to_contacts)
        if not self.sending_data:
            self.sending_data = True
            t.start()


profile_updater = ProfileUpdater()


class UserHandler(NewebeAuthHandler):
    '''
    This resource allows :
     * GET : retrieve current user (newebe owner) data.
     * POST : create a new user (if user exists, error response is returned).
     * PUT : modify current user data. Send profile to every contacts
     after a pre-defined time.
    '''


    def get(self):
        '''
        Retrieves current user (newebe owner) data at JSON format.
        '''

        users = list()
        user = UserManager.getUser()
        users.append(user)

        self.return_documents(users)


    def put(self):
        '''
        Modifies current user data with sent data (user object at JSON format).
        Then forwards it to contacts after a pre-defined time.
        '''

        user = UserManager.getUser()
    
        data = self.request.body

        if data:
            postedUser = json_decode(data)
            user.name = postedUser["name"]
            user.url = postedUser["url"]
            user.description = postedUser["description"]
            user.save()

            profile_updater.forward_profile()

            self.return_success("User successfully Modified.")
        else:
            self.return_failure("No data were sent.")


class ContactUpdateHandler(NewebeHandler):


    def put(self):
        '''
        When a put request is received, contact data are expected. If contact
        key is one of the trusted contact key, its data are updated with 
        received ones.
        '''      

        data = self.request.body

        if data:
            putContact = json_decode(data)
            key = putContact["key"]            

            contact = ContactManager.getTrustedContact(key)
            if contact:
                contact.url = putContact["url"]
                contact.description = putContact["description"]
                contact.name = putContact["name"]
                contact.save()
         
                self.create_modify_activity(contact)

                self.return_success("Contact successfully modified.")
       
            else:
                self.return_failure(
                        "No contact found corresponding to given contact", 404)
        
        else:
            self.return_failure("Empty data.")


    def create_modify_activity(self, contact):
        '''
        Creates an activity that describes a contact profile modification.
        '''

        activity = Activity(
             authorKey = contact.key,
             author = contact.name,
             verb = "modifies",
             docType = "profile",
             method = "PUT",
             docId = "none",
             isMine = False
        )
        activity.save()


class ContactsPendingHandler(NewebeAuthHandler):
    '''
    This is the resource for contact data management. It allows :
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
    This is the resource for contact data management. It allows :
     * GET : contacts that wait for approval.
    '''


    def get(self):
        '''
        Retrieve whole contact list at JSON format.
        '''

        contacts = ContactManager.getRequestedContacts()

        self.return_documents(contacts)


class ContactHandler(NewebeAuthHandler):
    '''
    Resource to manage specific contacts.
    GET: Gets a contact for a given slug.
    PUT: Modifies contact corresponding to given slug.
    DELETE: Deletes contact corresponding to given slug.
    '''


    def get(self, slug):
        '''
        Retrieves contact corresponding to slug at JSON format.
        '''

        contact = ContactManager.getContact(slug)

        if contact:
            self.return_document(contact)

        else:
            self.return_failure("Contact does not exist.")

 
    def put(self, slug):
        '''
        Modifies contact with data coming from request.
        '''

        contact = ContactManager.getContact(slug)
        contact.state = STATE_TRUSTED
        contact.save()

        user = UserManager.getUser()
        data = user.asContact().toJson()

        try:
             url = contact.url
             client = HTTPClient()
             request = HTTPRequest("%scontacts/confirm/" % url, 
                                   method="POST", body=data)

             response = client.fetch(request)
             incomingData = response.body
             newebeResponse = json_decode(incomingData)
             if not newebeResponse["success"]:
                 contact.state = STATE_ERROR
                 contact.save()
                 self.return_failure("Error occurs while confirming contact.")

        except:
            contact.state = STATE_ERROR
            contact.save()
            self.return_failure("Error occurs while confirming contact.")


        self.return_success("Contact trusted.")


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


    def post(self):
        '''
        Creates a new contact from web client data 
        (contact object at JSON format). And send a contact request to the
        newly created contact. State of contact is set to PENDING.
        '''

        logger = logging.getLogger("newebe.contact")

        data = self.request.body

        if data:
            postedContact = json_decode(data)
            url = postedContact['url']


            owner = UserManager.getUser()

            if owner.url != url:

                slug = slugify(url)

                contact = Contact(
                  url = url,
                  slug = slug
                )
                contact.save()
            
                try:
                    data = UserManager.getUser().asContact().toJson()

                    client = HTTPClient()
                    request = HTTPRequest("%scontacts/request/" % url, 
                                          method="POST", body=data)

                    response = client.fetch(request)
                    data = response.body
                    
                    newebeResponse = json_decode(data)
                    if not newebeResponse["success"]:
                        contact.state = STATE_ERROR
                        contact.save()

                except Exception:
                    import traceback
                    logger.error("Error on adding contact:\n %s" % 
                            traceback.format_exc())

                    contact.state = STATE_ERROR
                    contact.save()

                return self.return_json(contact.toJson(), 201)

            else:
                return self.return_failure(
                        "Wrong data. Url is same as owner URL.", 400)
        else:
            return self.return_failure(
                    "Wrong data. Contact has not been created.", 400)

class ContactRetryHandler(NewebeAuthHandler):
    '''
    This handler allows to resend contact request to a contact that have
    already received contact request.
    * POST: Send a new contact request to given contact if its state is
    set as Pending or Error.
    '''


    def post(self, slug):
        '''
        When post request is received, contact of which slug is equal to
        slug is retrieved. If its state is Pending or Error, the contact
        request is send again.
        '''

        logger = logging.getLogger("newebe.contact")

        contact = ContactManager.getContact(slug)
        owner = UserManager.getUser()

        if contact and contact.url != owner.url:
            try:
                data = owner.asContact().toJson()

                client = HTTPClient()
                url = contact.url 
                request = HTTPRequest("%scontacts/request/" % url, 
                                      method="POST", body=data)

                response = client.fetch(request)
                data = response.body
                
                if response.code != 200:
                    contact.state = STATE_ERROR
                    contact.save()

                else:
                    contact.state = STATE_WAIT_APPROVAL
                    contact.save()

            except Exception:
                import traceback
                logger.error("Error on adding contact:\n %s" % 
                        traceback.format_exc())

                contact.state = STATE_ERROR
                contact.save()

            return self.return_json(contact.toJson(), 200)
        else:
            self.return_failure("Contact does not exist", 404)


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
        data = self.request.body

        if data:
            postedContact = json_decode(data)
            url = postedContact["url"]
            owner = UserManager.getUser()

            if url is not None and owner.url != url:
                slug = slugify(url)

                contact = ContactManager.getContact(slug)
                owner = UserManager.getUser()

                if contact is None:
                    contact = Contact(
                        name = postedContact["name"], 
                        url = url,
                        slug = slug,
                        key = postedContact["key"],
                        state = STATE_WAIT_APPROVAL,
                        requestDate = datetime.datetime.now(),
                        description = postedContact["description"]
                    )
                    contact.save()

                contact.state = STATE_WAIT_APPROVAL
                contact.save()

                self.return_success("Request received.")

            else:
                self.return_failure("Sent data are incorrects.")

        else:
            self.return_failure("Sent data are incorrects.")


class ContactConfirmHandler(NewebeAuthHandler):
    '''
    This is the resource for contact confirmation. It allows :
     * POST : confirm a contact and set its state to TRUSTED.
    '''


    def post(self):
        '''
        Updates contact from sent data (contact object at JSON format).
        Sets its status to Trusted.
        '''
        data = self.request.body

        if data:
            postedContact = json_decode(data)
            url = postedContact["url"]
            slug = slugify(url)
            key = postedContact["key"]
            name = postedContact["name"]

            contact = ContactManager.getContact(slug)

            if contact:
                contact.state = STATE_TRUSTED
                contact.key = key
                contact.name = name
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
            if contact.description:
                contact.description = markdown.markdown(contact.description)

            self.render("../templates/core/contact/contact_render.html", 
                            contact=contact)            
        else:
            return self.return_failure("Contact not found.", 404)


# Template handlers.

class ContactTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/core/contact/contact.html")

class ContactContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/core/contact/contact_content.html")

class ContactTutorial1THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/core/contact/tutorial_1.html")

class ContactTutorial2THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/core/contact/tutorial_1.html")

