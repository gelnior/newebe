from django.conf.urls.defaults import patterns

from newebe.platform.views import UserResource, ContactResource, \
                                  ContactsResource, ContactPushResource
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
        ContactsResource()),
    (r'^contacts/pending/$', 
        ContactsResource("pending")),
    (r'^contacts/requested/$', 
        ContactsResource("requested")),
    (r'^contacts/request/$', 
        ContactPushResource()),
    (r'^contacts/(?P<slug>[0-9A-Za-z-]+)/$', 
        ContactResource()),
    (r'^contact/$', 
        DirectTemplateResource("platform/contact.html")),
    (r'^contact/content/$', 
        DirectTemplateResource("platform/contact_content.html")),
)

