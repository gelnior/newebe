# Global settings
import os


# User configuration
try:
    from newebe.local_settings import TORNADO_PORT, COUCHDB_DB_NAME, DEBUG, \
            TIMEZONE
except:
    TORNADO_PORT = 8000
    COUCHDB_DB_NAME = "newebe"
    DEBUG = False
    TIMEZONE = "GMT"


# Secret key used to encrypt cookie containing password.
try:
    from newebe.local_settings import COOKIE_KEY
except:
    COOKIE_KEY = "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="


# Set certificate files for HTTPS configuration.
try:
    from newebe.local_settings import PRIVATE_KEY, CERTIFICATE
except:
    PRIVATE_KEY = os.path.join("./", "server.key")
    CERTIFICATE = os.path.join("./", "server.crt")

# Credentials for database
try:
  from newebe.local_settings import USERNAME, PASSWORD
except:
  USERNAME = "newebe"
  PASSWORD = "newebe"


# Couchdb configuration
COUCHDB_DB_URI =  'http://%s:%s@127.0.0.1:5984/%s' % (USERNAME, PASSWORD, COUCHDB_DB_NAME)
COUCHDB_DATABASES = (
    ('newebe.news', COUCHDB_DB_URI),
    ('newebe.core', COUCHDB_DB_URI),
    ('newebe.activities', COUCHDB_DB_URI),
    ('newebe.notes', COUCHDB_DB_URI),
    ('newebe.pictures', COUCHDB_DB_URI),
)

INSTALLED_APPS = (
    'newebe.core',
    'newebe.activities',
    'newebe.news',
    'newebe.notes',
    'newebe.pictures',
)

