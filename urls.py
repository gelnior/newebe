from django.conf.urls.defaults import patterns, include
from django.conf import settings

from newebe.lib.rest import DirectTemplateResource

# Set applications urls
urlpatterns = patterns('',
    (r'^$', DirectTemplateResource('platform/profile.html')),    
    (r'^platform/', include('platform.urls')),
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


from newebe.platform.listener.change_listener import ChangeListener
changeListener = ChangeListener()
changeListener.start()
