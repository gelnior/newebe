import logging
import sys
import time

import tornado.ioloop
import tornado.httpserver
import tornado.ioloop
import tornado.web

from threading import Thread
from lettuce import before, after, world

sys.path.append("../")

from newebe.contacts.models import Contact, ContactManager
from tornado.httpclient import HTTPError

from newebe.lib.slugify import slugify
from newebe.lib.test_util import NewebeClient, SECOND_NEWEBE_ROOT_URL,\
                                 db2, reset_documents


class Server(Thread):
    def __init__(self, app):
        self.http = tornado.httpserver.HTTPServer(app)
        Thread.__init__(self)

    def run(self):
        logger = logging.getLogger("")
        logger.info("Newebe started on port 8888.")
        try:
            self.http.listen(8888)
            tornado.ioloop.IOLoop.instance().start()

        except KeyboardInterrupt:
            self.http.stop()
            tornado.ioloop.IOLoop.instance().stop()
            print ""
            logger.info("Newebe stopped.")


@before.all
def run_server():
    for i, path in enumerate(sys.path):
        if path.endswith('bin'):
            del sys.path[i]

    from newebe.newebe_server import Newebe
    app = Newebe()
    world.server = Server(app)
    try:
        world.server.start()

    except KeyboardInterrupt:
        world.server.http.stop()
        tornado.ioloop.IOLoop.instance().stop()


@after.all
def kill_server(total):
    logger = logging.getLogger("")

    logger.info("Stop server.")

    world.server.http.stop()
    tornado.ioloop.IOLoop.instance().stop()
    sys.exit()


@before.all
def set_browers():
    reset_documents(Contact, ContactManager.getContacts)
    reset_documents(Contact, ContactManager.getContacts, db2)

    world.browser = NewebeClient()
    world.browser.set_default_user()
    world.browser.login("password")

    try:
        world.browser2 = NewebeClient()
        world.browser2.set_default_user_2(SECOND_NEWEBE_ROOT_URL)
        world.user2 = world.browser2.user
        world.browser2.login("password")

        world.browser.post("contacts/all/",
                       body='{"url":"%s"}' % world.browser2.root_url)
        time.sleep(0.3)
        world.browser2.put("contacts/%s/" % slugify(world.browser.root_url.decode("utf-8")), "")
    except HTTPError:
        print "[WARNING] Second newebe instance does not look started"
