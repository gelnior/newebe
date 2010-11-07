from newebe import settings

from django.http import HttpResponse
from django.template import Context, loader
from django.http import HttpResponse

from newebe.lib import file_util

def jsFile(request, fileName):
    '''
    View for javascript file retrieving.
    Get from fileName the path of requested file by adding js media directory
    as path directory and .js as extension.
    Arguments :
        *request* HTTP django request object.
        *fileName* The javascript file name (without its extension) to retrieve.
    '''
    return getFile(fileName, settings.MEDIA_ROOT_JS, "js")


def cssFile(request, fileName):
    '''
    View for css file retrieving.
    Get from fileName the path of requested file by adding css media directory
    as path directory and .css as extension.
    Arguments :
        *request* HTTP django request object.
        *fileName* The css file name (without its extension) to retrieve.
    '''
    return getFile(fileName, settings.MEDIA_ROOT_CSS, "css")

def jqueryUiFile(request, fileName):
    return getFile(fileName, settings.MEDIA_ROOT_IMAGES + "jquery-ui/", "png")


def getFile(fileName, path, extension):
    '''
    Return file located at phath of wich extension is equal to *extension*.
    Arguments :
        *fileName* The css file name (without its extension) to retrieve.
        *path* The directory of the file to retrieve.
        *extension* The extension of the file to retrieve.
    '''
    path = '%s%s.%s' % (path, fileName, extension)
    return file_util.static_file_response(path)



