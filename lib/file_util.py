import os
import mimetypes

from django.conf import settings
from django.shortcuts import Http404
from django.http import HttpResponse


def static_file_response(path):
    '''
    Return in an HTTP response the file located at *path*.

    Arguments :
        *path* The path of the file to return.
    '''

    if not os.path.isfile(path):
        raise Http404("Media '%s' at '%s' is not a file" % (path, path))

    mimetype = mimetypes.guess_type(path)[0] or 'application/octet-stream'
    contents = open(path, 'rb').read()                                         
    response = HttpResponse(contents, mimetype=mimetype)
    response["Content-Length"] = len(contents)

    return response
                                 
