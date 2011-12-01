import sys
import tornado.ioloop
import tornado.web

sys.path.append("../../../")

from newebe.core.handlers import NewebeHandler
from newebe.profile.models import UserManager

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

application = tornado.web.Application([
    (r"/json/", JSONHandler),
    (r"/document/", DocumentHandler),
    (r"/documents/", DocumentsHandler),
    (r"/success/", SuccessHandler),
    (r"/failure/", FailureHandler),
])

if __name__ == "__main__":
    application.listen(7000)
    tornado.ioloop.IOLoop.instance().start()
