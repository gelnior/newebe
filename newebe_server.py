import logging
import sys, os

from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.web import Application

sys.path.append("../")
from newebe.settings import TORNADO_PORT, DEBUG, COOKIE_KEY, \
                            PRIVATE_KEY, CERTIFICATE

from newebe.routes import routes
import newebe.lib.pid as pid


# Set logging configuration
FORMAT = '[%(levelname)s] %(asctime)s: %(message)s'
logging.basicConfig(format=FORMAT, level=logging.INFO)
logger = logging.getLogger(__name__)


class Newebe(Application):
    '''
    Main application that allows access to Newebe data via REST services.
    '''

    def __init__(self):
        settings = {
          "static_path": os.path.join(os.path.dirname(__file__), "static"),
          "cookie_secret": COOKIE_KEY,
          "login_url": "/login",
        }
        Application.__init__(self, routes, debug=DEBUG, **settings)


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
            http_server = HTTPServer(tornado_app, xheaders=True,
                ssl_options = {
                    "certfile": CERTIFICATE,
                    "keyfile": PRIVATE_KEY,
                })

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
                http_server = HTTPServer(tornado_app, xheaders=True,
                                         ssl_options = {
                                            "certfile": CERTIFICATE,
                                            "keyfile": PRIVATE_KEY,
                                        })
                http_server.listen(TORNADO_PORT)

                logger.info("Starts Newebe on port %d." % TORNADO_PORT)
                ioloop = IOLoop.instance()
                ioloop.start()
            except:
                pass
            finally:
                # Ensure that the pidfile is removed.
                pid.remove(pidfile_path)


