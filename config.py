# -*- coding: utf-8 -*-
# * File Name : config.py
#
# * Copyright (C) 2010 Gaston TJEBBES <g.t@majerti.fr>
# * Company : Majerti ( http://www.majerti.fr )
#
#   This software is distributed under GPLV3
#   License: http://www.gnu.org/licenses/gpl-3.0.txt
#
# * Creation Date : 15-09-2012
# * Last Modified :
#
# * Project :
#
"""
    Provide a main config object to uniformize configuration access
"""
import importlib

from tornado.options import define
from tornado.options import options
from tornado.options import parse_command_line

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
            print("Loading the config file")
            settings = importlib.import_module(modulename)
        except ImportError, e:
            print("ImportError : The following file {0} is not well formed"\
                                                           .format(modulename))
            raise e
        return settings

    def _is_old_style_settings(self, settings):
        """
            Are the current settings old style ones ?
        """
        return "TORNADO_PORT" in settings.__dict__

    def _load_old_style_settings(self, settings):
        """
            Load old style settings file
        """
        self['main']['port'] = settings.TORNADO_PORT
        self['main']['debug'] = settings.DEBUG
        self['main']['timezone'] = settings.TIMEZONE

        self['security']['cookie_key'] = settings.COOKIE_KEY
        self['security']['certificate'] = settings.CERTIFICATE
        self['security']['private_key'] = settings.PRIVATE_KEY
        self['db']['name'] = settings.COUCHDB_DB_NAME
        self['db']['uri'] = settings.COUCHDB_DB_URI.rsplit('/', 1)[0]
        self['db']['views'] = [table[0]
                                for table in settings.COUCHDB_DATABASES]

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
        self['db'].update(settings.DB)
        self['main'].update(settings.MAIN)
        self['security'].update(settings.SECURITY)

    def load(self, modulename):
        """
            Load the modulename
        """
        settings = self._get_settings_module(modulename)
        if self._is_old_style_settings(settings):
            self._load_old_style_settings(settings)
        else:
            self._load_settings(settings)

CONFIG = Config()
CONFIG.load("settings")

define('uri', default=CONFIG.db.uri,
               help="Couch DB Uri              : --uri=http://127.0.0.1:5984")
define('name', default=CONFIG.db.name,
               help="Couch DB Name             : --name=newebe (default)")
define('port', default=CONFIG.main.port,
               help="Port newebe may be run on : --port=8000 (default)")
define('debug', default=CONFIG.main.debug,
               help="Debug mode                : --debug=True")
parse_command_line()
CONFIG.db.uri = options.uri
CONFIG.db.name = options.name
CONFIG.main.port = options.port
CONFIG.main.debug = options.debug
