from django.conf.urls.defaults import *

from newebe.platform.views import MediaFileResource

from newebe import settings

# Resources instanciation
jsResource = MediaFileResource(settings.MEDIA_ROOT_JS, "js")
cssResource = MediaFileResource(settings.MEDIA_ROOT_CSS, "css")
jQueryUiResource = MediaFileResource(settings.MEDIA_ROOT_IMAGES +  "jquery-ui/",
                                     "png")
# URL configuration
urlpatterns = patterns('',
#    (r'^js/(?P<fileName>[0-9A-Za-z-]+)/$', jsResource),
#    (r'^css/(?P<fileName>[0-9A-Za-z-]+)/$', cssResource),
#    (r'^css/jquery-ui-black-tie/images/(?P<fileName>[0-9A-Za-z-_]+).png/$', 
#         jQueryUiResource),
)

