from django.utils import simplejson as json
from django.http import HttpResponseNotFound

from newebe.lib import file_util, json_util
from newebe.lib.rest import NewebeResource, JsonResponse, CreationResponse, \
                            ErrorResponse, RestResource, SuccessResponse

from newebe.platform.models import User, UserManager
from newebe.platform.contactmodels import Contact, ContactManager

from django.template.defaultfilters import slugify

STATE_PENDING = "pending"

class MediaFileResource(NewebeResource):
    '''
    The media file resource furnishes REST URIs to file. A resource must be set
    for each of kind of file you want to give access : a resource works returns
    only files from a specfied folder with a specified extension.
    '''

    def __init__(self, folder, extension):
        '''
        Constructor : set folder extension of returned files.

        Arguments :
            *path* The directory of the file to retrieve.
            *extension* The extension of the file to retrieve.
        '''
        self.folder = folder
        self.extension = extension

    def GET(self, request, fileName):
        '''
        Return file located at *folder* of wich name is *fileName* and 
        extension is equal to *extension*.
 
        Arguments :
            *fileName* The name of the file (without its extension) to retrieve.
        '''

        path = '%s%s.%s' % (self.folder, fileName, self.extension)
        return file_util.staticFileResponse(path)
        


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

        return JsonResponse(json_util.getJsonFromDocList(users))

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
            return ErrorResponse("User has not been created.")


    def PUT(self, request):
        '''
        Modify current user data with sent data (user object at JSON format).
        '''
        user = UserManager.getUser()
    
        data = request.raw_post_data

        if data:
            postedUser = json.loads(data)
            user.name = postedUser["name"]
            user.save()

        return SuccessResponse("User successfully Modified.")


class ContactsResource(NewebeResource):
    '''
    This is the resource for contact data management. It allows :
     * GET : retrieve all contacts data.
     * POST : create a new contact.
    '''

    def __init__(self):
        self.methods = ['GET', 'POST', 'PUT', 'DELETE']


    def GET(self, request):
        '''
        Retrieve whole contact list at JSON format.
        '''
        contacts = ContactManager.getContacts()

        return JsonResponse(json_util.getJsonFromDocList(contacts))


    def POST(self, request):
        '''
        Create a new contact from sent data (contact object at JSON format).
        '''

        data = request.raw_post_data

        print data
        if data:
            postedContact = json.loads(data)
            url = postedContact['url']
            slug = slugify(url)

            contact = Contact(
              url = url,
              slug = slug,
              state = STATE_PENDING
            )
            contact.save()

            return CreationResponse(contact.toJson())

        else:
            return ErrorResponse("User has not been created.")


class ContactResource(NewebeResource):
    '''
    '''

    def __init__(self):
        self.methods = ['GET', 'PUT', 'DELETE']


    def GET(self, request, slug):
        '''
        Retrieve contact corresponding to slug at JSON format.
        '''
        contact = ContactManager.getContact(slug)

        if contact:
            print "cool 2"
            contacts = [contact]
            response = JsonResponse(json_util.getJsonFromDocList(contacts))
        else:
            response = HttpResponseNotFound("Contact does not exist.")

        return response

    
    def PUT(self, request, slug):
        pass

    def DELETE(self, request, slug):
        '''
        Delete contact corresponding to slug.
        '''
        print "toto"
        contact = ContactManager.getContact(slug)

        if contact:
            contact.delete()
            response = SuccessResponse("Contact has been deleted.")
        else:
            response = ErrorResponse("Contact does not exist.")
        return response

