"""
    Provide a main config object to uniformize configuration access
"""
import os
import importlib
import yaml
import string
import random

from tornado.options import define
from tornado.options import options
from tornado.options import parse_command_line

from newebe.apps import news, core, activities, notes, commons, pictures


class KeyDict(dict):
    """
        Usefull dict wrapper to allow key access as attributes
    """
    def __init__(self, **kwargs):
        dict.__init__(self, **kwargs)
        self.__dict__ = self


class Config(KeyDict):
    """
        The main config object
        [main]
        TORNADO_PORT
        DEBUG
        TIMEZONE

        [security]
        COOKIE_KEY
        PRIVATE_KEY
        CERTIFICATE

        [db]
        COUCHDB_DB_NAME
        COUCHDB_DB_URI
        COUCHDB_DATABASES
    """
    def __init__(self, **kwargs):
        KeyDict.__init__(self, **kwargs)
        self['db'] = KeyDict()
        self['main'] = KeyDict()
        self['security'] = KeyDict()

    def _get_settings_module(self, modulename):
        """
            Return the settings
        """
        try:
            print("Loading the config file: {name}".format(name=modulename))
            settings = importlib.import_module(modulename)
        except ImportError:
            print("ImportError : The following file {0} is not well formed"\
                   .format(modulename))
        return settings

    def _load_settings(self, settings):
        """
            Load new style settings file
            DB = dict(name=COUCHDB_DB_NAME,
                      uri=COUCHDB_DB_URI,
                      views=COUCHDB_DATABASES)
            SECURITY = dict(cookie_key=COOKIE_KEY,
                            certificate=CERTIFICATE,
                            private_key=PRIVATE_KEY)
            MAIN = dict(port=TORNADO_PORT,
                        debug=DEBUG,
                        timezone=TIMEZONE)
        """
        if "main" in settings:
            self['main'].update(settings["main"])
        if "security" in settings:
            self['security'].update(settings["security"])
        if "db" in settings:
            self['db'].update(settings["db"])

    def load(self, configfile_name):
        """
            Load the modulename
        """

        if os.path.exists(configfile_name):
            configfile = open(configfile_name)
            data = yaml.load(configfile)
            self._load_settings(data)
            configfile.close()


# Set default values
CONFIG = Config()
CONFIG['main']['port'] = 8000
CONFIG['main']['debug'] = False
CONFIG['main']['ssl'] = True
CONFIG['main']['timezone'] = "Europe/Paris"
CONFIG['main']['configfile'] = "./config.yaml"
CONFIG['main']['path'] = "/home/newebe/newebe/"
CONFIG['main']['logpath'] = None

chars = string.ascii_lowercase + string.ascii_uppercase + string.digits
CONFIG['security']['cookie_key'] = \
    ''.join(random.choice(chars) for x in range(42))
CONFIG['security']['certificate'] = None
CONFIG['security']['private_key'] = None
CONFIG['db']['name'] = "newebe"
CONFIG['db']['uri'] = "http://127.0.0.1:5984"
CONFIG['db']['views'] = {'newebe.apps.news': news,
                         'newebe.apps.core': core,
                         'newebe.apps.activities': activities,
                         'newebe.apps.notes': notes,
                         'newebe.apps.commons': commons,
                         'newebe.apps.pictures': pictures}


# Define config from command line arguments
define('configfile', default=CONFIG.main.configfile,
               help="Config file path          : --configfile=./config.yaml")
define('dburi', default=CONFIG.db.uri,
               help="Couch DB Uri              : --dburi=http://127.0.0.1:5984")
define('dbname', default=CONFIG.db.name,
               help="Couch DB Name             : --dbname=newebe (default)")
define('port', default=CONFIG.main.port,
               help="Port newebe may be run on : --port=8000 (default)")
define('debug', default=CONFIG.main.debug,
               help="Debug mode                : --debug=False")
define('ssl', default=CONFIG.main.ssl,
               help="Https enabled             : --ssl=True")

parse_command_line()
CONFIG.db.uri = options.dburi
CONFIG.db.name = options.dbname
CONFIG.main.port = options.port
CONFIG.main.debug = options.debug
CONFIG.main.ssl = options.ssl

config_file = "./config.yaml"
if options.configfile is not None:
    config_file = options.configfile
if os.path.exists(config_file):
    CONFIG.load(config_file)
