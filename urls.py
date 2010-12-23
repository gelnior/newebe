from django.conf.urls.defaults import patterns, include
from django.conf import settings

from newebe.lib.rest import DirectTemplateResource

urlpatterns = patterns('',
    (r'^$', DirectTemplateResource('platform/profile.html')),    
    (r'^platform/', include('platform.urls')),
    (r'^news/', include('news.urls')),
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}),

)

#from django.contrib.staticfiles.urls import staticfiles_urlpatterns
#urlpatterns += staticfiles_urlpatterns()
#from django.conf import settings

#if settings.DEBUG:
#    urlpatterns = patterns('django.contrib.staticfiles.views',
#        url(r'^static/(?P<path>.*)$', 'serve'),
 #   )

