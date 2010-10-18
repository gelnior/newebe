from django.conf.urls.defaults import *
from newebe.main import views


urlpatterns = patterns('django.views.generic.simple',
    (r'^$', 'direct_to_template', {'template': 'greetings.html'}),
    (r'^tweets/$', views.home),
)
