import os
import logging
import mimetypes

from tornado.web import asynchronous
from tornado.escape import json_decode
from couchdbkit.exceptions import ResourceNotFound
from PIL import Image

from newebe.profile.models import UserManager
from newebe.core.handlers import NewebeAuthHandler, NewebeHandler

from newebe.contacts.models import ContactManager
from newebe.pictures.models import PictureManager, Picture
from newebe.lib.date_util import get_date_from_db_date, \
                                 get_db_date_from_url_date

logger = logging.getLogger("newebe.pictures")


class PicturesHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve last posted pictures.
    
    * GET: Retrieves all pictures ordered by title.
    * POST: Create a picture.
    '''


    def get(self, startKey=None):
        '''
        Returns last posted pictures.
        '''
        
        pictures = list()

        if startKey:
            dateString = get_db_date_from_url_date(startKey)
            pictures = PictureManager.get_last_pictures(startKey=dateString)

        else:
            pictures = PictureManager.get_last_pictures()

        self.return_documents(pictures)


    @asynchronous
    def post(self):
        '''
        Creates a picture and corresponding activity. Then picture is 
        propagated to all trusted contacts.

        Errors are stored inside activity.
        '''

        file = self.request.files['picture'][0]

        if file:
            filebody = file["body"]
            filename = file['filename']

            picture = Picture(title = "New Picture", 
                    path=file['filename'],
                    contentType=file["content_type"], 
                    authorKey = UserManager.getUser().key,
                    author = UserManager.getUser().name)
            picture.save()
            picture.put_attachment(filebody, filename)
            thumbnail = self.get_thumbnail(filebody, filename, (200, 200))  
            picture.put_attachment(thumbnail.read(), "th_" + filename)
            os.remove("th_" + filename)           
            preview = self.get_thumbnail(filebody, filename, (1000, 1000))
            picture.put_attachment(preview.read(), "prev_" + filename)
            os.remove("th_" + filename)           
            picture.save()

            self.create_creation_activity(UserManager.getUser().asContact(),
                    picture, "publishes", "picture")

            self.send_files_to_contacts("pictures/contact/", 
                        fields = { "json": str(picture.toJson()) },
                        files = [("picture", str(picture.path), file["body"])])
                        
            logger.info("Picture %s successfuly posted." % filename)
            self.return_json(picture.toJson(), 201)

        else:
            self.return_failure("No picture posted.", 400)


    def get_thumbnail(self, filebody, filename, size):            
        file = open(filename, "w")
        file.write(filebody)  
        file.close()
        image = Image.open(filename)
        image.thumbnail(size, Image.ANTIALIAS)
        image.save("th_" + filename)
        file = open(filename)
        os.remove(filename)
        return open("th_" + filename)


class PicturesMyHandler(NewebeAuthHandler):
    '''
    This handler handles requests that retrieve last pictures posted by
    Newebe owner.
    
    * GET: Retrieves last pictures posted by newebe owner.
    * POST: Creates a picture.
    '''


    def get(self, startKey=None):
        '''
        Returns last posted pictures.
        '''
        pictures = PictureManager.get_owner_last_pictures()
        

        if startKey:
            dateString = get_db_date_from_url_date(startKey)
            pictures = PictureManager.get_owner_last_pictures(
                    startKey=dateString)
        else:
            pictures = PictureManager.get_owner_last_pictures()

        self.return_documents(pictures)


class PicturesQQHandler(PicturesHandler):
    '''
    This handler handles requests from QQ uploader to post new pictures.
    
    * POST: Create a picture.
    '''

    @asynchronous
    def post(self):
        '''
        Creates a picture and corresponding activity. Then picture is 
        propagated to all trusted contacts.

        Errors are stored inside activity.
        '''

        filebody = self.request.body
        filename = self.get_argument("qqfile")
        filetype = mimetypes.guess_type(filename)[0] or \
                'application/octet-stream'

        if filebody:

            picture = Picture(title = "New Picture", 
                    path=filename,
                    contentType=filetype, 
                    authorKey = UserManager.getUser().key,
                    author = UserManager.getUser().name)
            picture.save()
            picture.put_attachment(content=filebody, name=filename)            
            thumbnail = self.get_thumbnail(filebody, filename, (200, 200))  
            picture.put_attachment(thumbnail.read(), "th_" + filename)
            os.remove("th_" + filename)           
            preview = self.get_thumbnail(filebody, filename, (1000, 1000))
            picture.put_attachment(preview.read(), "prev_" + filename)
            os.remove("th_" + filename)
            picture.save()

            self.create_creation_activity(UserManager.getUser().asContact(),
                    picture, "publishes", "picture")

            self.send_files_to_contacts("pictures/contact/", 
                        fields = { "json": str(picture.toJson()) },
                        files = [("picture", str(picture.path), filebody)])
            
            logger.info("Picture %s successfuly posted." % filename)
            self.return_json(picture.toJson(), 201)

        else:
            self.return_failure("No picture posted.", 400)


class PictureContactHandler(NewebeHandler):
    '''
    This handler handles requests coming from contacts.

    * POST : Creates a new picture.
    * PUT :  Delete a picture.
    '''

    def post(self):
        '''
        Extract picture and file linked to the picture from request, then creates
        a picture in database for the contact who sends it. An activity is 
        created too.

        If author is not inside trusted contacts, the request is rejected.
        '''

        file = self.request.files['picture'][0]
        data = json_decode(self.get_argument("json"))

        if file and data:
            contact = ContactManager.getTrustedContact(
                    data.get("authorKey", ""))
            
            if contact:
                date = get_date_from_db_date(data.get("date", ""))

                picture = Picture(
                    title = data.get("title", ""),
                    path = data.get("path", ""),
                    contentType = data.get("contentType", ""),
                    authorKey = data.get("authorKey", ""),
                    author = data.get("author", ""),
                    date = date,
                    isMine = False
                )
                picture.save()
                picture.put_attachment(content=file["body"], 
                                       name=file['filename'])
                picture.save()
                
                self.create_creation_activity(contact,
                        picture, "publishes", "picture")

                self.return_success("Creation succeeds", 201)

            else:
                self.return_failure("Author is not trusted.", 400)                
        else:
            self.return_failure("No data sent.", 405)


    def put(self):
        '''
        Delete picture of which data are given inside request.
        Picture is found with contact key and creation date.

        If author is not inside trusted contacts, the request is rejected.
        '''

        data = self.get_body_as_dict()

        if data:
            contact = ContactManager.getTrustedContact(
                    data.get("authorKey", ""))
            
            if contact:
                picture = PictureManager.get_contact_picture(
                        contact.key, data.get("date", ""))

                if picture:
                    self.create_deletion_activity(contact, 
                            picture, "deletes", "picture")
                picture.delete()

                self.return_success("Deletion succeeds")

            else:
                self.return_failure("Author is not trusted.", 400)      


        else:
            self.return_failure("No data sent.", 405)


class PictureFileHandler(NewebeAuthHandler):
    '''
    Returns file linked to a given picture document.
    '''

    def get(self, id, filename):
        '''
        Returns file linked to given picture.
        '''

        picture = PictureManager.get_picture(id)
        if picture:
            try:
                file = picture.fetch_attachment(filename)
                self.set_header("Content-Type", picture.contentType)
                self.write(file)
                self.finish()
            except ResourceNotFound:
                self.return_failure("Picture not found.", 404)

        else:
            self.return_failure("Picture not found.", 404)



class PictureHandler(NewebeAuthHandler):
    '''
    Handles operations on a single picture.

    * GET : Retrieves picture corresponding to id given in URL.
    * DELETE : Deletes picture corresponding to id given in URL.
    '''


    def get(self, id):
        '''
        Retrieves picture corresponding to id.
        '''
        picture = PictureManager.get_picture(id)
        if picture:
            self.return_document(picture)
        else:
            self.return_failure("Picture not found.", 404)


    @asynchronous
    def delete(self, id):
        '''
        Deletes picture corresponding to id.
        '''

        picture = PictureManager.get_picture(id)
        if picture:
            contact = UserManager.getUser().asContact()
            self.create_deletion_activity(contact,
                        picture, "deletes", "picture")            
            self.send_deletion_to_contacts("pictures/contact/", picture)
            picture.delete()
            self.return_success("Picture deleted.")
        else:
            self.return_failure("Picture not found.", 404)



class PictureTHandler(NewebeAuthHandler):
    '''
    This handler allows to retrieve picture at HTML format.
    * GET: Return for given id the HTML representation of corresponding 
           picture.
    '''
    

    def get(self, pid):
        '''
        Returns for given id the HTML representation of corresponding 
        picture.
        '''

        picture = PictureManager.get_picture(pid)
        if picture:
            self.render("templates/picture.html", picture=picture)
        else:
            self.return_failure("Micropost not found.", 404)




# Template handlers

class PicturesTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/pictures.html")

class PicturesTestsTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/pictures_tests.html")

class PicturesContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/pictures_content.html")


