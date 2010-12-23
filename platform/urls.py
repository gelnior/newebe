from django.conf.urls.defaults import patterns

from newebe.platform.views import UserResource
from newebe.lib.rest import DirectTemplateResource

# URL configuration
urlpatterns = patterns('',
    (r'^user/$', 
        UserResource()),
    (r'^profile/$', 
        DirectTemplateResource("platform/profile.html")),
    (r'^profile/content/$', 
        DirectTemplateResource("platform/profile_content.html")),
    (r'^profile/menu-content/$', 
        DirectTemplateResource("platform/profile_menu_content.html")),
)

