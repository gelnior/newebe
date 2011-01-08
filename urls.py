from django.conf.urls.defaults import patterns, include
from django.conf import settings

from newebe.lib.resource import DirectTemplateResource

# Set applications urls
urlpatterns = patterns('',
    (r'^$', DirectTemplateResource('core/profile/profile.html')),    
    (r'^', include('core.urls')),
    (r'^news/', include('news.urls')),
)

##
# In production mode, static files (media files) must be accessed via a 
# HTTP server like Nginx, Apache, Cherokee...
if settings.DEBUG:
    urlpatterns += patterns('',
        (
            r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}
        ),
    )

