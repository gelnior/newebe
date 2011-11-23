import logging
import hashlib


from tornado.escape import json_decode, json_encode
from tornado.web import RequestHandler

from newebe.lib import json_util
from newebe.profile.models import UserManager

logger = logging.getLogger("newebe.core")


class NewebeHandler(RequestHandler):
    '''
    NewebeHandler is a base class to provide utility methods for handlers used 
    by the newebe application.
    '''


    def return_json(self, json, statusCode=200):
        '''
        Return a response containing json (content-type already set).
        '''

        self.set_status(statusCode)
        self.set_header("Content-Type", "application/json")
        self.write(json)
        self.finish()


    def return_documents(self, documents, statusCode=200):
        '''
        Return a response containing a list of newebe documents at json format. 
        '''

        self.return_json(
                json_util.get_json_from_doc_list(documents), statusCode)


    def return_document(self, document, statusCode=200):
        '''
        Return a response containing a list of newebe documents at json format. 
        '''

        self.return_json(json_util.get_json_from_doc_list([document]), 
                                                          statusCode)


    def return_success(self, text, statusCode=200):
        '''
        Return a success response containing a JSON object that describes
        the success.
        '''

        self.return_json(json_encode({ "success" : text }), statusCode)
 

    def return_failure(self, text, statusCode=500):
        '''
        Return an error response containing a JSON object that describes
        the error.
        '''
       
        logger.error(text)
        self.return_json(json_encode({ "error" : text }), statusCode)


    def get_body_as_dict(self):
        '''
        Return request body as a dict if body is written in JSON. Else None
        is returned.
        '''

        data = self.request.body
        if data:
            dataDict = json_decode(data)
            return dataDict
        else:
            return None


    def get_json_from_response(self, response):
        '''
        Extracts json from response and convert it as a dict.
        '''

        data = response.body
        if data:
            dataDict = json_decode(data)
            return dataDict
        else:
            return None


class NewebeAuthHandler(NewebeHandler):
    '''
    Base handler for every services that needs authentication. 
    For each request to this kind of handler, if user 
    is not logged in, it is directly redirected to login page. If no user
    exists, it is redirected to register page.
    '''

    def prepare(self):
        user = self.current_user
        if not user:
            self._finished = True


    def get_current_user(self):
        '''
        With tornado, authentication is handled in this method.
        '''

        user = UserManager.getUser()

        if user:

            if user.password is None:
                logger.error("User has no password registered")
                self.redirect("/register/password/")

            else:
                password = self.get_secure_cookie("password")

                if not password or  \
                   user.password != hashlib.sha224(password).hexdigest():
                    logger.error("User is not authenticated")
                    self.redirect("/login/")

                else:
                    return user

        else:
            logger.error("User is not authenticated")
            self.redirect("/register/")

