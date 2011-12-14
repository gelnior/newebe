import logging
import sys, os

from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.web import Application

sys.path.append("../")
from newebe.settings import TORNADO_PORT, DEBUG

import newebe.lib.pid as pid


from newebe.contacts.handlers import ContactUpdateHandler, \
                                 ContactContentTHandler, \
                                 ContactTutorial1THandler, \
                                 ContactTutorial2THandler, \
                                 ContactPushHandler, ContactConfirmHandler, \
                                 ContactHandler, ContactsHandler, \
                                 ContactsPendingHandler, \
                                 ContactsRequestedHandler, \
                                 ContactsTrustedHandler, \
                                 ContactRenderTHandler, ContactRetryHandler

from newebe.contacts.handlers import ContactTHandler

from newebe.profile.handlers import UserHandler, \
                                    ProfileTHandler, \
                                    ProfileContentTHandler, \
                                    ProfileMenuContentTHandler,  \
                                    ProfileTutorial1THandler, \
                                    ProfileTutorial2THandler

from newebe.auth.handlers import LoginHandler, LogoutHandler, \
                                 LoginJsonHandler,\
                                 RegisterTHandler, RegisterPasswordTHandler, \
                                 RegisterPasswordContentTHandler, \
                                 UserPasswordHandler

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

from newebe.notes.handlers import NotesHandler, \
                                  NotesByDateHandler, NoteHandler, \
                                  NotesPageTHandler, NotesContentTHandler, \
                                  NoteTHandler

from newebe.pictures.handlers import PicturesHandler, PictureFileHandler, \
                                    PicturesMyHandler, \
                                    PictureContactHandler, PictureHandler, \
                                    PicturesTHandler, PicturesTestsTHandler, \
                                    PicturesContentTHandler, \
                                    PicturesQQHandler, PictureTHandler

from newebe.sync.handlers import SynchronizeHandler, SynchronizeContactHandler


# Set certificate files for HTTPS configuration.
PRIVATE_KEY = os.path.join("./", "server.key")
CERTIFICATE = os.path.join("./", "server.crt")

# Set logging configuration
FORMAT = '[%(levelname)s] %(asctime)s: %(message)s'
logging.basicConfig(format=FORMAT, level=logging.INFO)
logger = logging.getLogger(__name__)


class Newebe(Application):
    '''
    Main application that allows access to Newebe data via REST services.
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
            ('/user/password/', UserPasswordHandler),
            
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
            ('/contacts/trusted/$', ContactsTrustedHandler),
            ('/contacts/confirm/$', ContactConfirmHandler),
            ('/contacts/request/$', ContactPushHandler),
            ('/contacts/render/([0-9A-Za-z-]+)/$', ContactRenderTHandler),
            ('/contacts/([0-9A-Za-z-]+)/$', ContactHandler),
            ('/contacts/([0-9A-Za-z-]+)/retry/$', ContactRetryHandler),

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

            ('/notes/', NotesPageTHandler),
            ('/notes/content/', NotesContentTHandler),
            ('/notes/all/', NotesHandler),
            ('/notes/all/order-by-title/', NotesHandler),
            ('/notes/all/order-by-date/', NotesByDateHandler),
            ('/notes/([0-9a-z]+)/', NoteHandler),
            ('/notes/([0-9a-z]+)/html/', NoteTHandler),

            ('/synchronize/', SynchronizeHandler),
            ('/synchronize/contact/', SynchronizeContactHandler),

            ('/pictures/', PicturesTHandler),
            ('/pictures/tests/', PicturesTestsTHandler),
            ('/pictures/content/', PicturesContentTHandler),
            ('/pictures/last/$', PicturesHandler),
            ('/pictures/last/my/$', PicturesMyHandler),
            ('/pictures/fileuploader/$', PicturesQQHandler),
            ('/pictures/contact/$', PictureContactHandler),
            ('/pictures/([0-9a-z]+)/$', PictureHandler),
            ('/pictures/([0-9a-z]+)/render/$', PictureTHandler),
            ('/pictures/([0-9a-z]+)/(.+)', PictureFileHandler),            
        ]
       
        if DEBUG:
            handlers.extend([
                ('/pictures/tests/', PicturesTestsTHandler)
            ])

        settings = {
          "static_path": os.path.join(os.path.dirname(__file__), "static"),
          "cookie_secret": "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
          "login_url": "/login",
        }
        Application.__init__(self, handlers, debug=DEBUG, **settings)


class NewebeIOLoop(IOLoop):
    '''
    Override of Tornado IO loop to avoid logging when async requests fail.    
    '''
    def handle_callback_exception(callback):
        pass

if __name__ == '__main__':

    '''
    Main function : it is here where tornado server is configured and launched 
    as a Newebe instance.
    '''

    # Application server setup
    logger = logging.getLogger("newebe")
    logger.info("Sets up application server.")
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
            logger.debug("Starts Newebe on port %d." % TORNADO_PORT)
            ioloop = NewebeIOLoop.instance()
            ioloop.start()

        except KeyboardInterrupt, e:
            ioloop.stop()
            connections = []
            print ""
            logger.info("Server stopped.")

    else:
        from daemon import daemon
        # Send log ouptut to a file.
        log_file = 'newebe.%s.log' % TORNADO_PORT
        log = open(os.path.join("./", log_file), 'a+')
        logging.getLogger().setLevel(logging.INFO)
        
        # Check pidfile.
        pidfile_path = "./newebe.pid"
        pid.check(pidfile_path)

        # Daemonize.
        daemon_context = daemon.DaemonContext(stdout=log, stderr=log, 
                                              working_directory='.')
        with daemon_context:
            # Write the pidfile.
            pid.write(pidfile_path)

            # Starts server.
            try:
                http_server = HTTPServer(tornado_app)
                http_server.listen(TORNADO_PORT)

                logger.info("Starts Newebe on port %d." % TORNADO_PORT)
                ioloop = IOLoop.instance()
                ioloop.start()
            except:
                pass
            finally:
                # Ensure that the pidfile is removed.
                pid.remove(pidfile_path)


