from django.conf.urls.defaults import patterns

from newebe.platform.views import UserResource, ContactResource
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

    (r'^contacts/$', 
        ContactResource()),
    (r'^contact/$', 
        DirectTemplateResource("platform/contact.html")),
    (r'^contact/content/$', 
        DirectTemplateResource("platform/contact_content.html")),
)

