from django.conf.urls.defaults import *
from newebe.news import views
from newebe.news.views import WallResource, NewsItemResource


wall_handler = WallResource()
news_item_handler = NewsItemResource()

urlpatterns = patterns('',
#'django.views.generic.simple',
    (r'^wall/$', wall_handler),
    (r'news-item/$', news_item_handler),
    (r'news-item/(?P<startKey>[0-9\-]+)/$', news_item_handler),
)
