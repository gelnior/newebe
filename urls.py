from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from django.conf import settings
#from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('',
    (r'^$', direct_to_template, {'template': 'platform/home.html'}),    
    (r'^platform/', include('platform.urls')),
    (r'^news/', include('news.urls')),
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_ROOT}),

)

#urlpatterns += staticfiles_urlpatterns()

#from django.conf import settings


#if settings.DEBUG:
#    urlpatterns = patterns('django.contrib.staticfiles.views',
#        url(r'^static/(?P<path>.*)$', 'serve'),
 #   )

