# Global settings

try:
    from newebe.local_settings import *
except:
    TORNADO_PORT = 8000
    COUCHDB_DB_NAME = "newebe"
    DEBUG = False

# Couchdb configuration
COUCHDB_DATABASES = (
    ('newebe.news', 'http://127.0.0.1:5984/%s' % COUCHDB_DB_NAME),
    ('newebe.core', 'http://127.0.0.1:5984/%s' % COUCHDB_DB_NAME),
    ('newebe.activities', 'http://127.0.0.1:5984/%s' % COUCHDB_DB_NAME),
    ('newebe.notes', 'http://127.0.0.1:5984/%s' % COUCHDB_DB_NAME),
)

INSTALLED_APPS = (
    'newebe.core',
    'newebe.activities',
    'newebe.news',
    'newebe.notes',
)

