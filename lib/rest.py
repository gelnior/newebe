from django import http
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render_to_response
from django.template import RequestContext

from newebe.platform.models import UserManager

JSON_MIMETYPE = "application/json"

class RestResource(object):
    """
    Base class to build a REST resource, it redirects call made to resource
    to the python method which has the same name as the HTTP method of received
    request.

    Ex: When a GET request is received, the *self.GET(request)* method handles 
    it.
    """

    # Possible methods; subclasses could override this.
    methods = ['GET', 'POST', 'PUT', 'DELETE']    

    def __call__(self, request, *args, **kwargs):
        callback = getattr(self, request.method, None)
        if callback:
            return callback(request, *args, **kwargs)
        else:
            allowed_methods = [m for m in self.methods if hasattr(self, m)]
            return http.HttpResponseNotAllowed(allowed_methods)


class NewebeResource(RestResource):
    '''
    RestResource that returns 403 response if no user is set in DB.
    '''

    def __call__(self, request, *args, **kwargs):
        
        if UserManager.getUser():
            return RestResource.__call__(self, request, *args, **kwargs)
        else:
            return HttpResponseForbidden()


class TemplateResource(RestResource):
    '''
    RestResource that returns subscription page if no user is set in DB.
    '''
    methods = ['GET']    

    def __init__(self):    
        RestResource.__init__(self)
        self.methods = ['GET']

    def __call__(self, request, *args, **kwargs): 
        if UserManager.getUser():
            return RestResource.__call__(self, request, *args, **kwargs)
        else:
            return render_to_response("platform/register.html",                 
                     context_instance=RequestContext(request))


class DirectTemplateResource(TemplateResource):
    '''
    Template resource that returns template located at path given to default.
    Context is the default context.
    If no user is set, it returns subscription page.
    '''

    def __init__(self, templatePath):
        TemplateResource.__init__(self)
        self.template = templatePath


    def GET(self, request):
        '''
        Return template located at *self.templatePath*.
        '''
        print self.template
        return render_to_response(self.template,
                                  { "user": UserManager.getUser() },
                                  context_instance=RequestContext(request))


class JsonResponse(HttpResponse):
    '''
    Http response configured to return JSON data.
    '''

    def __init__(self, json):
        HttpResponse.__init__(self, json, status=200, mimetype=JSON_MIMETYPE)


class  CreationResponse(HttpResponse):
    '''
    Http response configured to return JSON date, with a Creation Success code
    (201)
    '''

    def __init__(self, json):
        HttpResponse.__init__(self, json, status=201, mimetype=JSON_MIMETYPE)


class  ErrorResponse(HttpResponse):
    '''
    Http response to return an error message encapsuled in a JSON object with
    one entry of which *error* is the key and given text the value. Server
    error code (500) is set.
    '''

    def __init__(self, errorText):
        json = '{ "errror": "%s" }' % errorText 
        HttpResponse.__init__(self, json, status=500, mimetype=JSON_MIMETYPE)


class  SuccessResponse(JsonResponse):
    '''
    Http response to return a success message encapsuled in a JSON object with
    one entry of which *success* is the key and given text the value. Server
    success code (200) is set.
    '''

    def __init__(self, successText):
        json = '{ "success": "%s" }' % successText
        JsonResponse.__init__(self, json)
