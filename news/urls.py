from django.conf.urls.defaults import patterns

from newebe.lib.resource import DirectTemplateResource

urlpatterns = patterns('',
    (r'^$', 
        DirectTemplateResource("news/news.html")),
)
