# Global settings
TORNADO_PORT = 8000
COUCHDB_DB_NAME = "newebe_test"
DEBUG = False

# Main variables
SECRET_KEY = '*=$m*%d4u8gi$ry8#_ez&**3s#8wtv8x^a3_tdrk$snhd-uw_a'

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

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '[%(levelname)s] %(asctime)s: %(message)s'
        },
    },
    'handlers': {
        'null': {
            'level':'DEBUG',
            'class':'django.utils.log.NullHandler',
        },
        'console':{
            'level':'DEBUG',
            'class':'logging.StreamHandler',
            'formatter': 'simple'
        }
    },
    'loggers': {
        'newebe': {
            'handlers': ['console'],
            'level': 'DEBUG',
        }
    }
}

/bin/bash: q : commande introuvable
