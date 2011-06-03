import datetime
import logging
import hashlib

from threading import Timer

from tornado.web import RequestHandler
from tornado.httpclient import HTTPClient, HTTPRequest

from django.template.defaultfilters import slugify

from newebe.lib import json_util
from django.utils import simplejson as json
from newebe.core.models import User, UserManager
from newebe.core.models import Contact, ContactManager, \
                               STATE_WAIT_APPROVAL, STATE_ERROR, \
                               STATE_TRUSTED
from newebe.activities.models import Activity


class NewebeHandler(RequestHandler):
    '''
    NewebeHandler is a base class to provide utility methods for handlers used 
    by the newebe application.
    '''


    def returnJson(self, json, statusCode=200):
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

        self.returnJson(json_util.getJsonFromDocList(documents), statusCode)


    def return_document(self, document, statusCode=200):
        '''
        Return a response containing a list of newebe documents at json format. 
        '''

        self.returnJson(json_util.getJsonFromDocList([document]), statusCode)


    def returnSuccess(self, text, statusCode=200):
        '''
        Return a success response containing a JSON object that describes
        the success.
        '''

        self.returnJson(json.dumps({ "success" : text }), statusCode)
 

    def returnFailure(self, text, statusCode=500):
        '''
        Return an error response containing a JSON object that describes
        the error.
        '''
        
        self.returnJson(json.dumps({ "error" : text }), statusCode)



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

                if user.password != password:
                    self.redirect("/login/")
                else:
                    return user
        else:
            self.redirect("/register/")



class LoginHandler(RequestHandler):
    '''
    * GET:  displaying page for logging in.
    * POST: Get password via a form. Set a secure cookie if password is OK 
    then redirects to root page.
    Else it redirects to login page.
    '''


    def get(self):
        '''
        Displaying page for logging in.
        '''

        self.render("../templates/core/login.html")


    def post(self):
        '''
        Get password via a form. Set a secure cookie if password is OK 
        then redirects to root page.
        Else it redirects to login page.
        '''

        password = self.get_argument("password")
        user = UserManager.getUser()

        if user and user.password == hashlib.sha224(password).hexdigest():
            
            self.set_secure_cookie("password", password)
            self.redirect("/")
        else:
            self.redirect("/login/")


class LoginJsonHandler(NewebeHandler):
    '''
    * POST: Get password via a json object.  Sets a secure cookie if password 
    is OK. Else it returns an error response. 
    '''


    def post(self):
        '''
        Get password via a json object.  Sets a secure cookie if password 
        is OK. Else it returns an error response.
        '''
        data = self.request.body

        if data:
            postedData = json.loads(data)
            password = postedData["password"]
            user = UserManager.getUser()
    
            if user and user.password == hashlib.sha224(password).hexdigest():
            
                self.set_secure_cookie("password", password)
                self.returnSuccess("You are now logged in.")

            else:
                self.returnFailure("Wrong password.")

        else:
            self.returnFailure("Wrong password.")


class LogoutHandler(RequestHandler):
    '''
    GET : Remove secure cookie for password then redirects to login page.
    '''

    def get(self):
        '''
        Remove secure cookie for password then redirects to login page.
        '''

        self.clear_cookie("password")
        self.redirect("/login/")


global sending_data
sending_data= False


def send_profile_to_contacts():
     '''
     External methods to not send too much times the changed profile. 
     A timer is set to wait for other modifications before running this
     function that sends modification requests to every contacts.
     '''

     client = HTTPClient()
     global sending_data
     sending_data = False

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
     activity.save()

     for contact in ContactManager.getTrustedContacts():
         request = HTTPRequest("%scontacts/update-profile/" % contact.url, 
                      method="PUT", body=jsonbody)
         client.fetch(request)

def forward_profile():

    t = Timer(5.0, send_profile_to_contacts)
    global sending_data
    if not sending_data:
        sending_data = True
        t.start()


class UserHandler(NewebeAuthHandler):
    '''
    This is the main resource of the application. It allows :
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
            postedUser = json.loads(data)
            user.name = postedUser["name"]
            user.url = postedUser["url"]
            user.description = postedUser["description"]
            user.save()

            forward_profile()

            self.returnSuccess("User successfully Modified.")
        else:
            self.returnFailure("No data were sent.")



class RegisterPasswordTHandler(NewebeHandler):

    def get(self):

        user = UserManager.getUser()
        if user and user.password:
           self.redirect("/") 
        else:
            self.render("../templates/core/password.html")

        self.render("../templates/core/password.html")

    def post(self):

        user = UserManager.getUser()

        if user is None:
            self.returnFailure("User does not exist.")

        if user.password is not None:
            self.returnFailure("Password is already set.")

        data = self.request.body

        if data:
            postedPassword = json.loads(data)
            password = hashlib.sha224(postedPassword['password']).hexdigest()
            user.password = password
            user.save()

            self.returnJson(user.toJson())

        else:
            self.returnFailure(
                    "Data are not correct. User password is not set.", 400)


class RegisterTHandler(NewebeHandler):


    def get(self):

        if UserManager.getUser():
           self.redirect("/") 
        else:
            self.render("../templates/core/register.html")


    def post(self):
        '''
        Create a new user (if user exists, error response is returned) from
        sent data (user object at JSON format).
        '''      

        if UserManager.getUser():
            self.returnFailure("User already exists.")

        data = self.request.body

        if data:
            postedUser = json.loads(data)
            user = User()
            user.name = postedUser['name']
            user.save()

            user.key = user._id
            user.save()

            self.set_status(201)
            self.returnJson(user.toJson())

        else:
            self.returnFailure(
                    "Data are not correct. User has not been created.", 400)


class ContactUpdateHandler(NewebeHandler):


    def put(self):
        '''
        
        '''      

        data = self.request.body

        if data:
            putContact = json.loads(data)
            key = putContact["key"]            

            contact = ContactManager.getTrustedContact(key)
            if contact:
                contact.url = putContact["url"]
                contact.description = putContact["description"]
                contact.name = putContact["name"]
                contact.save()
         
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

                self.returnSuccess("Contact successfully Modified.")
       
            else:
                self.returnFailure(
                        "No contact found corresponding to given contact", 404)
        else:
            self.returnFailure("Empty data.")


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
            self.returnFailure("Contact does not exist.")

    
    def put(self, slug):
        '''
        Modifies contact with data coming from request.
        '''

        contact = ContactManager.getContact(slug)
        contact.state = STATE_TRUSTED
        contact.save()

        user = UserManager.getUser()
        data = user.toContact().toJson()

        try:
             url = contact.url
             client = HTTPClient()
             request = HTTPRequest("%scontacts/confirm/" % url, 
                                   method="POST", body=data)

             response = client.fetch(request)
             incomingData = response.body
             newebeResponse = json.loads(incomingData)
             if not newebeResponse["success"]:
                 contact.state = STATE_ERROR
                 contact.save()
                 self.returnFailure("Error occurs while confirming contact.")

        except:
            contact.state = STATE_ERROR
            contact.save()
            self.returnFailure("Error occurs while confirming contact.")


        self.returnSuccess("Contact trusted.")


    def delete(self, slug):
        '''
        Deletes contact corresponding to slug.
        '''

        contact = ContactManager.getContact(slug)
        if contact:
            contact.delete()
            return self.returnSuccess("Contact has been deleted.")
        else:
            self.returnFailure("Contact does not exist.")


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
            postedContact = json.loads(data)
            url = postedContact['url']
            slug = slugify(url)

            contact = Contact(
              url = url,
              slug = slug
            )
            contact.save()
        
            try:
                data = UserManager.getUser().toContact().toJson()

                client = HTTPClient()
                request = HTTPRequest("%scontacts/request/" % url, 
                                      method="POST", body=data)

                response = client.fetch(request)
                data = response.body
                
                newebeResponse = json.loads(data)
                if not newebeResponse["success"]:
                    contact.state = STATE_ERROR
                    contact.save()

            except Exception:
                import traceback
                logger.error("Error on adding contact:\n %s" % 
                        traceback.format_exc())

                contact.state = STATE_ERROR
                contact.save()

            return self.returnJson(contact.toJson(), 201)

        else:
            return self.returnFailure(
                    "Wrong data. Contact has not been created.", 400)


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
            postedContact = json.loads(data)
            url = postedContact["url"]
            slug = slugify(url)
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
            self.returnSuccess("Request received.")
             
        else:
            self.returnFailure("Sent data are incorrects.")


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
            postedContact = json.loads(data)
            url = postedContact["url"]
            slug = slugify(url)
            key = postedContact["key"]
            name = postedContact["name"]

            contact = ContactManager.getContact(slug)
            contact.state = STATE_TRUSTED
            contact.key = key
            contact.name = name
            contact.save()
            

            self.returnSuccess("Contact trusted.")
             
        else:
            self.returnFailure("Sent data are incorrects.", 400)


class ContactRenderTHandler(NewebeAuthHandler):
    '''
    * GET: returns an HTML representation of contact corresponding to given
    ID. If ID is equal to null Newebe owner representation is returned.
    '''
    
    def get(self, key):
        '''

        '''

        contact = ContactManager.getTrustedContact(key)
        if key == "null":
             contact = UserManager.getUser().getContact()

        if contact: 
            self.render("../templates/core/contact/contact_render.html", 
                            contact=contact)            
        else:
            return self.returnFailure("Contact not found.", 404)


# Template handlers.

class RegisterPasswordContentTHandler(NewebeHandler):

    def get(self):
        self.render("../templates/core/password_content.html")

class ProfileTHandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/profile/profile.html")

class ProfileContentTHandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/profile/profile_content.html")

class ProfileMenuContentTHandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/profile/profile_menu_content.html")

class ProfileTutorial1THandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/profile/tutorial_1.html")

class ProfileTutorial2THandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/profile/tutorial_2.html")

class ContactTHandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/contact/contact.html")

class ContactContentTHandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/contact/contact_content.html")

class ContactTutorial1THandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/contact/tutorial_1.html")

class ContactTutorial2THandler(NewebeAuthHandler):

    def get(self):
        self.render("../templates/core/contact/tutorial_1.html")

