from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

urlpatterns = patterns('',
    (r'^$', direct_to_template, {'template': 'platform/home.html'}),    
    (r'^platform/', include('platform.urls')),
    (r'^news/', include('news.urls')),
)
