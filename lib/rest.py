from django import http
from django.conf import settings
from django.core import urlresolvers
from django.shortcuts import get_object_or_404, redirect
from django.utils.encoding import force_unicode
from django.http import HttpResponse


JSON_MIMETYPE = "application/json"

class RestResource(object):
    """
    Base class to build a REST resource, it redirects call to resource
    to python method which has the same name as the HTTP method of received
    request.
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

    def __init__(self, json):
        HttpResponse.__init__(self, json, status=200, mimetype=JSON_MIMETYPE)


class  CreationResponse(HttpResponse):

    def __init__(self, json):
        HttpResponse.__init__(self, json, status=201, mimetype=JSON_MIMETYPE)


class  ErrorResponse(HttpResponse):

    def __init__(self, errorText):
        json = '{ "errror": "%s" }' % errortText 
        HttpResponse.__init__(self, json, status=500, mimetype=JSON_MIMETYPE)


class  SuccessResponse(HttpResponse):

    def __init__(self, successText):
        json = '{ "success": "%s" }' % successText
        HttpResponse.__init__(self, json, mimetype=JSON_MIMETYPE)
