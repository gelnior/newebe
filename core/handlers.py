from tornado.web import RequestHandler
from newebe.lib.response import JSON_MIMETYPE 

from django.utils import simplejson as json

class NewebeHandler(RequestHandler):
    '''
    NewebeHandler is a base class to provide utility methods for handlers used 
    by the newebe application.
    '''

    def returnJson(self, json):
        '''
        Return a response containig json (content-type already set).
        '''
        self.set_header("Content-Type", JSON_MIMETYPE)
        self.write(json)
        self.finish()


    def returnSuccess(self, text, statusCode=200):
        '''
        Return a success response containing a JSON object that describes
        the success.
        '''
        self.set_status(statusCode)
        self.returnJson(json.dumps({ "success" : text }))
 

class TemplateHandler(RequestHandler):

    def __init__(self, application, request, template_file, **kwargs):
        '''
        Constructor : sets file name to use as template.
        '''
        NewebeHandler.__init__(self, application, request, **kwargs)
        self.template_file = template_file

    def get(self):
        self.render(self.template_file)



class ProfileContentTHandler(NewebeHandler):

    def get(self):
        self.render("../templates/core/profile/profile_content.html")

class ProfileMenuContentTHandler(NewebeHandler):

    def get(self):
        self.render("../templates/core/profile/profile_menu_content.html")

class ProfileTutorial1THandler(NewebeHandler):

    def get(self):
        self.render("../templates/core/profile/tutorial_1.html")

class ProfileTutorial2THandler(NewebeHandler):

    def get(self):
        self.render("../templates/core/profile/tutorial_2.html")


