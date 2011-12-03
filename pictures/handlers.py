import logging

from tornado.escape import json_decode

from newebe.profile.models import UserManager
from newebe.contacts.handlers import NewebeAuthHandler
from newebe.activities.models import Activity
from newebe.pictures.models import PictureManager, Picture

logger = logging.getLogger("newebe.pictures")

class PicturesHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve last posted pictures.
    
    * GET: Retrieves all pictures ordered by title.
    * POST: Create a picture.
    '''


    def get(self):
        '''
        Returns last posted pictures.
        '''
        pictures = PictureManager.get_last_pictures()
        self.return_documents(pictures)


    def post(self):
        file1 = self.request.files['picture'][0]
        picture = Picture(title = "New Picture", path=file1['filename'],
                contentType=file1["content_type"])
        picture.save()
        picture.put_attachment(content=file1["body"], name=file1['filename'])
        picture.save()

        self.create_creation_activity(UserManager.getUser().asContact(),
                picture, "publishes", "picture")
        self.return_success("Picture %s successfuly posted." % file1['filename'])


class PictureFileHandler(NewebeAuthHandler):


    def get(self, id, filename):
        picture = PictureManager.get_picture(id)
        file = picture.fetch_attachment(picture.path)
        self.set_header("Content-Type", picture.contentType)
        self.write(file)
        self.finish()
