import logging

import django.core.handlers.wsgi

from tornado.ioloop import IOLoop
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.web import FallbackHandler, Application

import sys, os
sys.path.append("../")
os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'
from newebe.settings import TORNADO_PORT, DEBUG
from newebe.news.handlers import NewsHandler, NewsContactHandler, \
                                 NewsSuscribeHandler, MicropostHandler


class Newebe(Application):
    '''
    Main application that wraps Django app and handles
    real time communications with contacts.
    '''
    def __init__(self):
        handlers = [
            ('/news/microposts/', NewsHandler),
            ('/news/microposts/([0-9a-z]+)', MicropostHandler),
            ('/news/microposts/contacts/', NewsContactHandler),
            ('/news/suscribe/', NewsSuscribeHandler),
            ('.*', FallbackHandler, dict(fallback=django_wsgi)),
        ]
        
        settings = dict()
        if not DEBUG: 
            settings = dict(
              static_path=os.path.join(os.path.dirname(__file__), "static"),
            )
        Application.__init__(self, handlers, **settings)



if __name__ == '__main__':

    '''
    Main function : it is here where tornado server is configured to
    wrap django server and then is launched as a Newebe instance.
    '''
    try:
        # Application server setup
        logger = logging.getLogger("newebe")
        logger.info("Sets up application server.")
        os.environ["DJANGO_SETTINGS_MODULE"] = 'newebe.settings'
        django_application = django.core.handlers.wsgi.WSGIHandler()
        django_wsgi = WSGIContainer(django_application)
        tornado_app = Newebe()
        http_server = HTTPServer(tornado_app)
        http_server.listen(TORNADO_PORT)

        # Server running.
        logger.info("Starts Newebe on port %d." % TORNADO_PORT)
        ioloop = IOLoop.instance()
        ioloop.start()

    except KeyboardInterrupt, e:
        ioloop.stop()
        connections = []
        print ""
        logger.info("Server stopped.")
        
