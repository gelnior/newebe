# Global settings
TORNADO_PORT = 8000
COUCHDB_DB_NAME = "newebe"
DEBUG = True

# Django settings for newebe project.

# Main variables
TEMPLATE_DEBUG = DEBUG
SITE_ID = 1
SECRET_KEY = '*=$m*%d4u8gi$ry8#_ez&**3s#8wtv8x^a3_tdrk$snhd-uw_a'

# Db config is set to sqlite3 because django does not accept synchronize 
# command if nothing is set.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'newebe', 
        'USER': '',   
        'PASSWORD': '', 
        'HOST': '',    
        'PORT': '',    
    }
}

# Couchdb configuration
COUCHDB_DATABASES = (
    ('newebe.news', 'http://127.0.0.1:5984/%s' % COUCHDB_DB_NAME),
    ('newebe.core', 'http://127.0.0.1:5984/%s' % COUCHDB_DB_NAME),
    ('newebe.activities', 'http://127.0.0.1:5984/%s' % COUCHDB_DB_NAME),
)

# Locale configuration
TIME_ZONE = 'Europe/Paris'
LANGUAGE_CODE = 'fr-fr'
USE_I18N = True
USE_L10N = True

import os
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Media configuration : path for CSS, JS and image files.
MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'static')
MEDIA_ROOT_JS = os.path.join(MEDIA_ROOT, 'js')
MEDIA_ROOT_CSS = os.path.join(MEDIA_ROOT, 'css')
MEDIA_ROOT_IMAGES = os.path.join(MEDIA_ROOT, 'images')


# Django middleware. CSRF is disabled, because it causes me trouble to post
# data but it should be enabled when security features will be added to the
# project.
MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
#    'django.contrib.sessions.middleware.SessionMiddleware',
#    'django.middleware.csrf.CsrfViewMiddleware',
#    'django.contrib.auth.middleware.AuthenticationMiddleware',
#    'django.contrib.messages.middleware.MessageMiddleware',
)

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

# Root URLs module.
ROOT_URLCONF = 'newebe.urls'

# Path to the django templates.
TEMPLATE_ROOT = os.path.join(PROJECT_ROOT, 'templates')
TEMPLATE_DIRS= (
    TEMPLATE_ROOT
)

# App installed in newebe
INSTALLED_APPS = (
#    'django.contrib.auth',
    'django.contrib.contenttypes',
#    'django.contrib.sessions',
    'django.contrib.sites',
#    'django.contrib.messages',

    'couchdbkit.ext.django',
    'newebe.core',
    'newebe.news',
    'newebe.activities',
)


# Static files URLs
STATIC_URL = "/static/"

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
        #'file': {
        #    'level': 'INFO',
        #    'class': 'logging.handlers.RotatingFileHandler',
        #    'formatter': 'simple',
        #    'filename': 'newebe.log',
        #    'maxBytes': 1024,
        #    'backupCount': 3,
        #}
    },
    'loggers': {
        'newebe': {
            'handlers': ['console'],
            'level': 'DEBUG',
        }
    }
}

