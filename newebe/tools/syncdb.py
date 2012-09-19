"""
Tool to synchronise database views written inside applicatons with Couchdb
server.

Code adapted from Django Coucdhbkit handler.
"""

import sys
from os.path import dirname, join, isdir
sys.path.append("../")

from couchdbkit import Server
from couchdbkit import push
from couchdbkit.resource import CouchdbResource
from newebe.config import CONFIG

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

    def sync_all_app(self, uri, dbname, views):
        '''
        Create a database session for each databases, then start the syncing
        process.
        Databases are described by tuples containing the application name and
        the database URL in which views must be synchronized.
        @param uri: Uri of the couchdb server
        @param dbname: Database name
        @param views: Name of the views
        '''
        for view in views:
            res = CouchdbResource(uri, timeout=COUCHDB_TIMEOUT)
            server = Server(uri, resource_instance=res)
            self.sync(server, dbname, view, views[view])

    def sync(self, server, dbname, view, module, verbosity=2):
        """
        Used to sync views of all applications and eventually create
        database.
        @param server: couchdb server object
        @param dbname: name of the database
        @param view: 'view' name
        @param module: module, provided here to calculate each view's
        _design/ path.
        """
        print "Sync `%s` in CouchDB server." % view
        db = server.get_or_create_db(dbname)

        app_name = module.__name__
        app_dir = dirname(module.__file__)
        design_path = join(app_dir, "_design")

        if not isdir(design_path):
            print >> sys.stderr,  \
                 "%s doesn't exists, doc wasn't synchronized" % design_path
        else:
            push(design_path, db, force=True, docid="_design/%s" % app_name)

        print "Sync of `%s` done." % view

if __name__ == '__main__':
    couchdbkit_handler = CouchdbkitHandler()
    couchdbkit_handler.sync_all_app(CONFIG.db.uri,
                                    CONFIG.db.name,
                                    CONFIG.db.views)
