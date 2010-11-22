from django.conf.urls.defaults import *
from newebe.news import views
from newebe.news.views import WallResource, NewsItemResource
from newebe.platform.views import MediaFileResource
from newebe import settings


wall_handler = WallResource()
news_item_handler = NewsItemResource()
jsResource = MediaFileResource(settings.MEDIA_ROOT_JS + "news/", "js")

urlpatterns = patterns('',
    (r'^wall/$', wall_handler),
    (r'news-item/$', news_item_handler),
    (r'news-item/(?P<startKey>[0-9\-]+)/$', news_item_handler),
    (r'^js/(?P<fileName>[0-9A-Za-z-]+)/$', jsResource),
)
