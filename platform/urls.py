from django.conf.urls.defaults import *

from newebe.platform import views

urlpatterns = patterns('django.views.generic.simple',
    # File urls
    (r'^js/(?P<fileName>[0-9A-Za-z-]+)/$', views.jsFile),
    (r'^css/(?P<fileName>[0-9A-Za-z-]+)/$', views.cssFile),
    (r'^css/jquery-ui-black-tie/images/(?P<fileName>[0-9A-Za-z-_]+).png/$', 
        views.jqueryUiFile),
)
