from newebe import settings

from django.http import HttpResponse
from django.template import Context, loader

from newebe.lib import file_util
from newebe.lib.rest import RestResource

class MediaFileResource(RestResource):
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
        



