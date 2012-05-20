"""
Tool to synchronise database views written inside applicatons with Couchdb 
server.

Code adapted from Django Coucdhbkit handler.
"""

import sys
import os
import re
sys.path.append("../")

from couchdbkit import Server
from couchdbkit import push
from couchdbkit.resource import CouchdbResource
from newebe import settings

COUCHDB_DATABASES = getattr(settings, "COUCHDB_DATABASES", [])
USERNAME = getattr(settings, "USERNAME", "")
PASSWORD = getattr(settings, "PASSWORD", "")
COUCHDB_SERVER_USERNAME = getattr(settings, "COUCHDB_SERVER_USERNAME", "")
COUCHDB_SERVER_PASSWORD = getattr(settings, "COUCHDB_SERVER_PASSWORD", "")
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

            # Auth with couchdb_server credentials
            super_server_uri = re.sub(USERNAME, COUCHDB_SERVER_USERNAME,
                re.sub(PASSWORD, COUCHDB_SERVER_PASSWORD, server_uri))

            # Create the db as a couchdb server admin, and create the
            # _security doc with the right members
            super_server = Server(super_server_uri, resource_instance =
                res)
            db = super_server.get_or_create_db(dbname)
            securitydoc = db.get("_security")
            if securitydoc == {} or USERNAME not in securitydoc["members"]["names"] and USERNAME not in securitydoc["admins"]["names"]:
              print "%s is not set as newebe database admin. Setting it." % USERNAME
              securitydoc = {"_id": "_security", "admins": {"names": [USERNAME], "roles":[]}, "members": {"names": [], "roles":[]}}
              db.save_doc(securitydoc)

            # Sync the applications
            simple_server_uri = server_uri
            server = Server(simple_server_uri, resource_instance=res)
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


