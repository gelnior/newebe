from django import http
from django.http import HttpResponse


JSON_MIMETYPE = "application/json"

class RestResource(object):
    """
    Base class to build a REST resource, it redirects call made to resource
    to the python method which has the same name as the HTTP method of received
    request.

    Ex: When a GET request is recieved, the *self.GET(request)* method handles 
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
