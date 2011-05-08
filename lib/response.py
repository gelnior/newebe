from django.http import HttpResponse
from newebe.lib import json_util

JSON_MIMETYPE = "application/json"


class JsonResponse(HttpResponse):
    '''
    Http response configured to return JSON data.
    '''

    def __init__(self, json):
        HttpResponse.__init__(self, json, status=200, mimetype=JSON_MIMETYPE)


class DocumentResponse(JsonResponse):
    '''
    Http response configured to return list of newebe documents (code 200).
    '''

    def __init__(self, documents):
        JsonResponse.__init__(self, json_util.getJsonFromDocList(documents))


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


class  BadRequestResponse(HttpResponse):
    '''
    Http response to return a Bad Request message encapsuled in a JSON object 
    with one entry of which *error* is the key and given text the value. Bad 
    request code (400) is set.
    '''

    def __init__(self, errorText):
        json = '{ "errror": "%s" }' % errorText 
        HttpResponse.__init__(self, json, status=400, mimetype=JSON_MIMETYPE)


class  SuccessResponse(JsonResponse):
    '''
    Http response to return a success message encapsuled in a JSON object with
    one entry of which *success* is the key and given text the value. Server
    success code (200) is set.
    '''

    def __init__(self, successText):
        json = '{ "success": "%s" }' % successText
        JsonResponse.__init__(self, json)


