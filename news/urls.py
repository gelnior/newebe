from django.conf.urls.defaults import patterns

from newebe.lib.rest import DirectTemplateResource
from newebe.news.views import NewsItemResource

news_item_handler = NewsItemResource()

urlpatterns = patterns('',
    (r'^wall/$', 
        DirectTemplateResource("news/wall.html")),
    (r'^wall/content/$', 
        DirectTemplateResource("news/wall_content.html")),
    (r'^news-item/$', 
        news_item_handler),
    (r'^news-item/(?P<startKey>[0-9\-]+)/$', 
        news_item_handler),
)
