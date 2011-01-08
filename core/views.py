import datetime

from urllib2 import Request, urlopen

from django.utils import simplejson as json
from django.http import HttpResponseNotFound
from django.template.defaultfilters import slugify

from newebe.lib.resource import NewebeResource, RestResource
from newebe.lib.response import CreationResponse, \
                                ErrorResponse, SuccessResponse, \
                                BadRequestResponse, DocumentResponse

from newebe.core.models import User, UserManager
from newebe.core.models import Contact, ContactManager, \
                               STATE_WAIT_APPROVAL, STATE_ERROR, \
                               STATE_TRUSTED




class UserResource(RestResource):
    '''
    This is the main resource of the application. It allows :
     * GET : retrieve current user (newebe owner) data.
     * POST : create a new user (if user exists, error response is returned).
     * PUT : modify current user data.
    '''

    def __init__(self):
        self.methods = ['GET', 'POST', 'PUT']


    def GET(self, request):
        '''
        Retrieve current user (newebe owner) data at JSON format.
        '''
        users = list()
        user = UserManager.getUser()
        users.append(user)

        return DocumentResponse(users)

    def POST(self, request):
        '''
        Create a new user (if user exists, error response is returned) from
        sent data (user object at JSON format).
        '''        
        if UserManager.getUser():
            return ErrorResponse("User already exists.")


        data = request.raw_post_data

        if data:
            postedUser = json.loads(data)
            user = User()
            user.name = postedUser['name']
            user.save()

            return CreationResponse(user.toJson())

        else:
            return BadRequestResponse(
                    "Data are not correct. User has not been created.")


    def PUT(self, request):
        '''
        Modify current user data with sent data (user object at JSON format).
        '''
        user = UserManager.getUser()
    
        data = request.raw_post_data

        if data:
            postedUser = json.loads(data)
            user.name = postedUser["name"]


            user.url = postedUser["url"]
            user.city = postedUser["city"]
            user.save()

        return SuccessResponse("User successfully Modified.")


class ContactsResource(NewebeResource):
    '''
    This is the resource for contact data management. It allows :
     * GET : retrieve all contacts data.
     * POST : create a new contact.
    
    ContactResource can be parameterized to retrieve only contacts
    with specific states :
      all = all contacts
      pending = only contacts that have not approved your contact request or
                contacts that returned an eroor.
      requested = contacts that wait for approval.
    '''

    def __init__(self, contactFilter = "all"):
        self.methods = ['GET', 'POST', 'PUT', 'DELETE']
        self.contactFilter = contactFilter


    def GET(self, request):
        '''
        Retrieve whole contact list at JSON format.
        '''
        if self.contactFilter and self.contactFilter is "pending":
            contacts = ContactManager.getPendingContacts()
        elif self.contactFilter and self.contactFilter is "requested":
            contacts = ContactManager.getRequestedContacts()
        else:
            contacts = ContactManager.getContacts()

        return DocumentResponse(contacts)


    def POST(self, request):
        '''
        Create a new contact from sent data (contact object at JSON format).
        '''
        data = request.raw_post_data

        if data:
            postedContact = json.loads(data)
            url = postedContact['url']
            slug = slugify(url)

            contact = Contact(
              url = url,
              slug = slug
            )
            contact.save()

            data = UserManager.getUser().toContact().toJson()
            req = Request("%scontacts/request/" % url, data)

            try:
                response = urlopen(req)
                data = response.read()
                
                newebeResponse = json.loads(data)
                if not newebeResponse["success"]:
                    contact.state = STATE_ERROR
                    contact.save()

            except:
                contact.state = STATE_ERROR
                contact.save()

            return CreationResponse(contact.toJson())

        else:
            return BadRequestResponse(
                    "Wrong data. Contact has not been created.")


class ContactResource(NewebeResource):
    '''
    Resource to manage specific contacts.
    GET: Gets a contact for a given slug.
    PUT: Modifies contact corresponding to given slug.
    DELETE: Deletes contact corresponding to given slug.
    '''

    def __init__(self):
        self.methods = ['GET', 'PUT', 'DELETE']


    def GET(self, request, slug):
        '''
        Retrieves contact corresponding to slug at JSON format.
        '''
        contact = ContactManager.getContact(slug)

        if contact:
            contacts = [contact]
            response = DocumentResponse(contacts)
            contact = Contact(
                name = UserManager.getUser().name,
            )

        else:
            response = HttpResponseNotFound("Contact does not exist.")

        return response

    
    def PUT(self, request, slug):
        '''
        Modifies contact with data coming from request.
        '''
        contact = ContactManager.getContact(slug)
        contact.state = STATE_TRUSTED
        contact.save()

        user = UserManager.getUser()
        data = user.toContact().toJson()

        req = Request("%scontacts/confirm/" % contact.url, data)

        try:
            response = urlopen(req)
            incomingData = response.read()
            newebeResponse = json.loads(incomingData)
            if not newebeResponse["success"]:
                contact.state = STATE_ERROR
                contact.save()
                return ErrorResponse("Error occurs while confirming contact.")
        except:
            contact.state = STATE_ERROR
            contact.save()
            return ErrorResponse("Error occurs while confirming contact.")


        return SuccessResponse("Contact trusted.")


    def DELETE(self, request, slug):
        '''
        Deletes contact corresponding to slug.
        '''

        contact = ContactManager.getContact(slug)
        print slug 
        if contact:
            contact.delete()
            response = SuccessResponse("Contact has been deleted.")
        else:
            response = BadRequestResponse("Contact does not exist.")
        return response


class ContactPushResource(RestResource):
    '''
    This is the resource for contact request. It allows :
     * POST : asks for a contact authorization.
    '''

    def __init__(self):
        self.methods = ['POST', 'PUT']


    def POST(self, request):
        '''
        Create a new contact from sent data (contact object at JSON format).
        Sets its status to Wait For Approval
        '''
        data = request.raw_post_data

        if data:
            postedContact = json.loads(data)
            url = postedContact["url"]
            slug = slugify(url)
            contact = Contact(
                name = postedContact["name"], 
                url = url,
                slug = slug,
                state = STATE_WAIT_APPROVAL,
                requestDate = datetime.datetime.now()
            )
            contact.save()
            response = SuccessResponse("Request received.")
             
        else:
           response = BadRequestResponse("Sent data are incorrects.")
    
        return response





class ContactConfirmResource(RestResource):
    '''
    This is the resource for contact confirmation. It allows :
     * POST : confirm a contact and set its state to TRUSTED.
    '''

    def __init__(self):
        self.methods = ['POST']


    def POST(self, request):
        '''
        Updates contact from sent data (contact object at JSON format).
        Sets its status to Trusted.
        '''
        data = request.raw_post_data

        if data:
            postedContact = json.loads(data)
            url = postedContact["url"]
            slug = slugify(url)
            key = postedContact["key"]

            contact = ContactManager.getContact(slug)
            contact.state = STATE_TRUSTED
            contact.key = key
            contact.save()
            

            response = SuccessResponse("Contact trusted.")
             
        else:
           response = BadRequestResponse("Sent data are incorrects.")
    
        return response


class ContactDocumentResource(RestResource):
    '''
    This resource allows contact to post documents to current user database.

    This is experimental. It should not be used.
    '''

    def __init__(self):
        self.methods = ['POST']


    def POST(self, request):
        '''
        Update contact from sent data (contact object at JSON format).
        Sets its status to Trusted.
        '''
        data = request.raw_post_data
            
        response = BadRequestResponse("Sent data are incorrects.")

        try:
            if data:
                doc = json.loads(data)

                if "authorKey" in doc:
                    key = doc["authorKey"]
                    contact = ContactManager.getTrustedContact(key)
                    if contact:
                        from newebe.core.listener.change_listener import db
                        del doc["_id"]
                        del doc["_rev"]
                        db.save_doc(doc)

                        response = SuccessResponse("Document saved.")
    
        except Exception, e:
            print e.message
        return response

