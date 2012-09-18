import sys
import tornado.ioloop
import tornado.web

sys.path.append("../")

from newebe.core.handlers import NewebeHandler
from newebe.apps.profile.models import UserManager

class JSONHandler(NewebeHandler):
    def get(self):
        self.return_json(UserManager.getUser().toJson())

class DocumentHandler(NewebeHandler):
    def get(self):
        self.return_document(UserManager.getUser())

class DocumentsHandler(NewebeHandler):
    def get(self):
        self.return_documents([UserManager.getUser(), UserManager.getUser()])

class SuccessHandler(NewebeHandler):
    def get(self):
        self.return_success("Test succeeds")

class FailureHandler(NewebeHandler):
    def get(self):
        self.return_failure("Test failed")

routes = ([
    (r"/json/", JSONHandler),
    (r"/document/", DocumentHandler),
    (r"/documents/", DocumentsHandler),
    (r"/success/", SuccessHandler),
    (r"/failure/", FailureHandler),
])

class FakeServer(tornado.web.Application):
    '''
    Main application that allows access to Newebe data via REST services.
    '''

    def __init__(self):
        tornado.web.Application.__init__(self, routes, debug=True)


