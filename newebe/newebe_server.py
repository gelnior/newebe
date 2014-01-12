#!/usr/bin/python

import logging
import sys, os

from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.web import Application

sys.path.append("../")
sys.path.append("/usr/share/pyshared/")

from newebe.config import CONFIG
from newebe.routes import routes
from newebe.tools.syncdb import CouchdbkitHandler

import newebe


# Set logging configuration
FORMAT = '[%(levelname)s] %(asctime)s: %(message)s'
logging.basicConfig(format=FORMAT, level=logging.INFO)
logger = logging.getLogger(__name__)


class Newebe(Application):
    '''
    Main application that allows access to Newebe data via REST services.
    '''

    def __init__(self):
        dirpath, filename = \
            os.path.split(os.path.abspath(newebe.__file__))
        path = os.path.join(dirpath, "client", "public")

        settings = {
          "static_path": path,
          "cookie_secret": CONFIG.security.cookie_key,
          "login_url": "/#login",
        }
        Application.__init__(self,
                             routes,
                             debug=CONFIG.main.debug,
                             **settings)

def init_db():
    couchdbkit_handler = CouchdbkitHandler()
    couchdbkit_handler.sync_all_app(CONFIG.db.uri,
                                    CONFIG.db.name,
                                    CONFIG.db.views)

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

    if not CONFIG.main.debug:
        # Send log ouptut to a file.
        log_file = 'newebe.%s.log' % CONFIG.main.port
        path = CONFIG.main.logpath
        if path is None:
            path = CONFIG.main.path
        log_file = os.path.join(path, log_file)
        formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
        hdlr = logging.FileHandler(os.path.join(".", log_file))
        hdlr.setFormatter(formatter)
        logger.addHandler(hdlr)
        logger.setLevel(logging.INFO)

        # Sync Couch DB views
        init_db()

    try:
        # SSL mode only in production
        if not CONFIG.main.debug and CONFIG.main.ssl:
            ssl_options = {}
            if CONFIG.security.certificate:
                ssl_options["certfile"] = CONFIG.security.certificate
            else:
                ssl_options["certfile"] = \
                    os.path.join(CONFIG.main.path, "certs", "server.crt")

            if CONFIG.security.private_key:
                ssl_options["keyfile"] = CONFIG.security.private_key
            else:
                ssl_options["keyfile"] = \
                    os.path.join(CONFIG.main.path, "certs", "server.key")
        else:
            ssl_options = None

        # Server running.
        http_server = HTTPServer(tornado_app, xheaders=True,
                                 ssl_options = ssl_options)

        http_server.listen(CONFIG.main.port)
        logger.info("Starts Newebe on port %d." % CONFIG.main.port)
        ioloop = NewebeIOLoop.instance()
        ioloop.start()


    except KeyboardInterrupt, e:
        ioloop.stop()
        print ""
        logger.info("Server stopped.")



