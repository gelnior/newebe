# Django settings for newebe project.

# Main variables
DEBUG = True
TEMPLATE_DEBUG = DEBUG
SITE_ID = 1
SECRET_KEY = '*=$m*%d4u8gi$ry8#_ez&**3s#8wtv8x^a3_tdrk$snhd-uw_a'

ADMINS = (
     ('newebe', 'gelnior@free.fr'),
)
MANAGERS = ADMINS

# Db config empty because of Couchdb usage.
DATABASES = {
    'default': {
        'ENGINE': '',
        'NAME': '', 
        'USER': '',   
        'PASSWORD': '', 
        'HOST': '',    
        'PORT': '',    
    }
}

# Couchdb configuration
COUCHDB_DATABASES = (
    ('newebe.main', 'http://127.0.0.1:5984/newebe'),
)

# Locale configuration
TIME_ZONE = 'France/Paris'
LANGUAGE_CODE = 'fr-fr'
USE_I18N = True
USE_L10N = True

# Media configuration
MEDIA_ROOT = '/home/Newebe/media/'
MEDIA_URL = '/media/'
ADMIN_MEDIA_PREFIX = '/media/'

ROOT_URLCONF = 'newebe.urls'

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_DIRS = (
    '/home/newebe/Newebe/templates/'
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',

    'django.contrib.admin',
    'couchdbkit.ext.django',
    'newebe.main',
)

# Fast-cgi need this line for working with Lighttpd.
FORCE_SCRIPT_NAME=""


