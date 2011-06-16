import logging


from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.web import Application

import sys, os
sys.path.append("../")
os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'
from newebe.settings import TORNADO_PORT, DEBUG

from newebe.core.handlers import ProfileTHandler, \
                                 ProfileContentTHandler, \
                                 ProfileMenuContentTHandler, \
                                 ProfileTutorial1THandler, \
                                 ProfileTutorial2THandler, \
                                 ContactUpdateHandler, ContactTHandler, \
                                 ContactContentTHandler, \
                                 ContactTutorial1THandler, \
                                 ContactTutorial2THandler, \
                                 UserHandler, \
                                 ContactPushHandler, ContactConfirmHandler, \
                                 ContactHandler, ContactsHandler, \
                                 ContactsPendingHandler, \
                                 ContactsRequestedHandler, \
                                 ContactRenderTHandler

from newebe.core.auth_handlers import LoginHandler, LogoutHandler, \
                                 LoginJsonHandler,\
                                 RegisterTHandler, RegisterPasswordTHandler, \
                                 RegisterPasswordContentTHandler

from newebe.news.handlers import NewsHandler, NewsContactHandler, \
                                 NewsSuscribeHandler, MicropostHandler, \
                                 MicropostTHandler, \
                                 MyNewsHandler, \
                                 NewsContentTHandler, NewsTHandler, \
                                 NewsTutorial1THandler, NewsTutorial2THandler, \
                                 NewsRetryHandler

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

            ('/login/', LoginHandler),
            ('/login/json/', LoginJsonHandler),
            ('/logout/', LogoutHandler),
            ('/register/', RegisterTHandler),
            ('/register/password/', RegisterPasswordTHandler),
            ('/register/password/content/', RegisterPasswordContentTHandler),
            
            ('/user/$', UserHandler),
            ('/profile/$', ProfileTHandler),
            ('/profile/content/$', ProfileContentTHandler),
            ('/profile/menu-content/$', ProfileMenuContentTHandler),
            ('/profile/tutorial/1/$', ProfileTutorial1THandler),
            ('/profile/tutorial/2/$', ProfileTutorial2THandler),

            ('/contacts/$', ContactsHandler),
            ('/contacts/update-profile/$', ContactUpdateHandler),
            ('/contacts/pending/$', ContactsPendingHandler),
            ('/contacts/requested/$', ContactsRequestedHandler),
            ('/contacts/confirm/$', ContactConfirmHandler),
            ('/contacts/request/$', ContactPushHandler),
            ('/contacts/render/([0-9A-Za-z-]+)/$', ContactRenderTHandler),
            ('/contacts/([0-9A-Za-z-]+)/$', ContactHandler),

            ('/contact/$', ContactTHandler),
            ('/contact/content/$', ContactContentTHandler),
            ('/contact/tutorial/1/$', ContactTutorial1THandler),
            ('/contact/tutorial/2/$', ContactTutorial2THandler),

            ('/news/', NewsTHandler),
            ('/news/microposts/', NewsHandler),
            ('/news/microposts/mine/([0-9\-]+)/', MyNewsHandler),
            ('/news/microposts/mine/', MyNewsHandler),
            ('/news/microposts/all/([0-9\-]+)/', NewsHandler),
            ('/news/microposts/all/', NewsHandler),
            ('/news/microposts/contacts/', NewsContactHandler),
            ('/news/micropost/([0-9a-z]+)/', MicropostHandler),
            ('/news/micropost/([0-9a-z]+)/html/', MicropostTHandler),
            ('/news/micropost/([0-9a-z]+)/retry/', NewsRetryHandler),
            ('/news/content/', NewsContentTHandler),
            ('/news/tutorial/1/', NewsTutorial1THandler),
            ('/news/tutorial/2/', NewsTutorial2THandler),
            ('/news/suscribe/', NewsSuscribeHandler),
 
            ('/activities/', ActivityPageHandler),
            ('/activities/content/', ActivityContentHandler),
            ('/activities/all/', ActivityHandler),
            ('/activities/all/([0-9\-]+)/', ActivityHandler),
            ('/activities/mine/', MyActivityHandler),
            ('/activities/mine/([0-9\-]+)/', MyActivityHandler),
        ]
        
        settings = {
          "static_path": os.path.join(os.path.dirname(__file__), "static"),
          "cookie_secret": "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
          "login_url": "/login",
        }
        Application.__init__(self, handlers, **settings)


PRIVATE_KEY = os.path.join("./", "server.key")
CERTIFICATE = os.path.join("./", "server.crt")


if __name__ == '__main__':

    '''
    Main function : it is here where tornado server is configured to
    wrap django server and then is launched as a Newebe instance.
    '''

    # Application server setup
    logger = logging.getLogger("newebe")
    logger.info("Sets up application server.")
    os.environ["DJANGO_SETTINGS_MODULE"] = 'newebe.settings'
    #django_application = django.core.handlers.wsgi.WSGIHandler()
    #django_wsgi = WSGIContainer(django_application)
    tornado_app = Newebe()

    if DEBUG:
        try:
            # Server running.
            http_server = HTTPServer(tornado_app)
#                    ,
#                ssl_options = {
#                    "certfile": CERTIFICATE,
#                    "keyfile": PRIVATE_KEY,
#                })

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


