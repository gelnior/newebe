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

from newebe.core.handlers import ProfileTHandler, \
                                 ProfileContentTHandler, \
                                 ProfileMenuContentTHandler, \
                                 ProfileTutorial1THandler, \
                                 ProfileTutorial2THandler, \
                                 ContactTHandler, \
                                 ContactContentTHandler, \
                                 ContactTutorial1THandler, \
                                 ContactTutorial2THandler, \
                                 UserHandler, \
                                 ContactPushHandler, ContactConfirmHandler, \
                                 ContactHandler, ContactsHandler, \
                                 ContactsPendingHandler, \
                                 ContactsRequestedHandler

from newebe.news.handlers import NewsHandler, NewsContactHandler, \
                                 NewsSuscribeHandler, MicropostHandler, \
                                 MyNewsHandler, \
                                 NewsContentTHandler, NewsTHandler, \
                                 NewsTutorial1THandler, NewsTutorial2THandler

from newebe.activities.handlers import ActivityHandler, MyActivityHandler, \
                                       ActivityContentHandler, \
                                       ActivityPageHandler

import newebe.lib.pid as pid


class Newebe(Application):
    '''
    Main application that wraps Django app and handles
    real time communications with contacts.
    '''

    def __init__(self):
        handlers = [
            ('/', NewsTHandler),

            ('/contacts/$', ContactsHandler),
            ('/contacts/pending/$', ContactsPendingHandler),
            ('/contacts/requested/$', ContactsRequestedHandler),
            ('/contacts/confirm/$', ContactConfirmHandler),
            ('/contacts/request/$', ContactPushHandler),
            ('/contacts/([0-9A-Za-z-]+)/$', ContactHandler),

            ('/contact/$', ContactTHandler),
            ('/contact/content/$', ContactContentTHandler),
            ('/contact/tutorial/1/$', ContactTutorial1THandler),
            ('/contact/tutorial/2/$', ContactTutorial2THandler),
            
            ('/user/$', UserHandler),
            ('/profile/$', ProfileTHandler),
            ('/profile/content/$', ProfileContentTHandler),
            ('/profile/menu-content/$', ProfileMenuContentTHandler),
            ('/profile/tutorial/1/$', ProfileTutorial1THandler),
            ('/profile/tutorial/2/$', ProfileTutorial2THandler),

            ('/news/', NewsTHandler),
            ('/news/microposts/', NewsHandler),
            ('/news/microposts/mine/([0-9\-]+)/', MyNewsHandler),
            ('/news/microposts/mine/', MyNewsHandler),
            ('/news/microposts/all/([0-9\-]+)/', NewsHandler),
            ('/news/microposts/all/', NewsHandler),
            ('/news/content/', NewsContentTHandler),
            ('/news/tutorial/1/', NewsTutorial1THandler),
            ('/news/tutorial/2/', NewsTutorial2THandler),
            ('/news/microposts/contacts/', NewsContactHandler),
            ('/news/microposts/([0-9a-z]+)/', MicropostHandler),
            ('/news/suscribe/', NewsSuscribeHandler),
 
            ('/activities/', ActivityPageHandler),
            ('/activities/content/', ActivityContentHandler),
            ('/activities/all/', ActivityHandler),
            ('/activities/all/([0-9\-]+)/', ActivityHandler),
            ('/activities/mine/', MyActivityHandler),
            ('/activities/mine/([0-9\-]+)/', MyActivityHandler),
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

    # Application server setup
    logger = logging.getLogger("newebe")
    logger.info("Sets up application server.")
    os.environ["DJANGO_SETTINGS_MODULE"] = 'newebe.settings'
    django_application = django.core.handlers.wsgi.WSGIHandler()
    django_wsgi = WSGIContainer(django_application)
    tornado_app = Newebe()

    if DEBUG:
        try:
            # Server running.
            http_server = HTTPServer(tornado_app)
            http_server.listen(TORNADO_PORT)
            logger.info("Starts Newebe on port %d." % TORNADO_PORT)
            ioloop = IOLoop.instance()
            ioloop.start()

        except KeyboardInterrupt, e:
            ioloop.stop()
            connections = []
            print ""
            logger.info("Server stopped.")

    else:
        from daemon import daemon
        # capture stdout/err in logfile
        log_file = 'newebe.%s.log' % TORNADO_PORT
        log = open(os.path.join("./", log_file), 'a+')
        
        # check pidfile
        pidfile_path = "./newebe.pid"
        pid.check(pidfile_path)

        # daemonize
        daemon_context = daemon.DaemonContext(stdout=log, stderr=log, 
                                              working_directory='.')
        with daemon_context:
            # write the pidfile
            pid.write(pidfile_path)

            # Server running.
            try:
                http_server = HTTPServer(tornado_app)
                http_server.listen(TORNADO_PORT)

                logger.info("Starts Newebe on port %d." % TORNADO_PORT)
                ioloop = IOLoop.instance()
                ioloop.start()
            finally:
                # ensure we remove the pidfile
                pid.remove(pidfile_path)


