"""
Tool to synchronise database views written inside applicatons with Couchdb 
server.

Code adapted from Django Coucdhbkit handler.
"""

import sys
import os
sys.path.append("../")

from couchdbkit import Server
from couchdbkit import push
from couchdbkit.resource import CouchdbResource
from newebe import settings

COUCHDB_DATABASES = getattr(settings, "COUCHDB_DATABASES", [])
COUCHDB_TIMEOUT = 300

class CouchdbkitHandler(object):

    # share state between instances
    __shared_state__ = dict(
            _databases = {}
    )   

    def __init__(self):
        """ initialize couchdbkit handler with COUCHDB_DATABASES
        settings """

        self.__dict__ = self.__shared_state__

    def sync_all_app(self, databases):
        '''
        Create a database session for each databases, then start the syncing
        process.
        Databases are described by tuples containing the application name and
        the database URL in which views must be synchronized.
        '''

        for app_name, uri in databases:
            try:
                if isinstance(uri, tuple):
                    # case when you want to specify server uri 
                    # and database name specifically. usefull
                    # when you proxy couchdb on some path 
                    server_uri, dbname = uri
                else:
                    server_uri, dbname = uri.rsplit("/", 1)
            except ValueError:
                raise ValueError("couchdb uri [%s:%s] invalid" % (
                    app_name, uri))

                
            res = CouchdbResource(server_uri, timeout=COUCHDB_TIMEOUT)
            server = Server(server_uri, resource_instance=res)

            self.sync(app_name, server, dbname)
   

    def sync(self, app_name, server, dbname, verbosity=2):
        """ 
        Used to sync views of all applications and eventually create
        database.
        """

        print "Sync `%s` in CouchDB server." % app_name

        db = server.get_or_create_db(dbname)
        app_label = app_name.split('.')[-1]

        app_path = os.path.abspath(os.path.join("./", 
                                                app_label.replace(".", "/")))
        design_path = "%s/%s" % (app_path, "_design")
        if not os.path.isdir(design_path):
            print >> sys.stderr,  \
                 "%s don't exists, no ddoc synchronized" % design_path
        else:
            push(os.path.join(app_path, "_design"), db, force=True,
                 docid="_design/%s" % app_label)

        print "Sync of `%s` done." % app_name
  

couchdbkit_handler = CouchdbkitHandler()
couchdbkit_handler.sync_all_app(COUCHDB_DATABASES)


