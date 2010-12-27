from django.conf.urls.defaults import patterns, include
from django.conf import settings

from newebe.lib.rest import DirectTemplateResource

urlpatterns = patterns('',
    (r'^$', DirectTemplateResource('platform/profile.html')),    
    (r'^platform/', include('platform.urls')),
    (r'^news/', include('news.urls')),
)


if settings.DEBUG:
    urlpatterns += patterns('',
        (
            r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}
        ),
    )

