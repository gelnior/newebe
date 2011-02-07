from django.conf.urls.defaults import patterns

from newebe.core.views import UserResource, ContactResource, \
                                  ContactsResource, ContactPushResource, \
                                  ContactConfirmResource, \
                                  ContactDocumentResource

from newebe.lib.resource import DirectTemplateResource

# URL configuration
urlpatterns = patterns('',
    (r'^user/$', 
        UserResource()),
    (r'^profile/$', 
        DirectTemplateResource("core/profile/profile.html")),
    (r'^profile/content/$', 
        DirectTemplateResource("core/profile/profile_content.html")),
    (r'^profile/menu-content/$', 
        DirectTemplateResource("core/profile/profile_menu_content.html")),
    (r'^profile/tutorial/1/$', 
        DirectTemplateResource("core/profile/tutorial_1.html")),
    (r'^profile/tutorial/2/$', 
        DirectTemplateResource("core/profile/tutorial_2.html")),

    (r'^contacts/$', 
        ContactsResource()),
    (r'^contacts/pending/$', 
        ContactsResource("pending")),
    (r'^contacts/requested/$', 
        ContactsResource("requested")),
    (r'^contacts/request/$', 
        ContactPushResource()),
    (r'^contacts/confirm/$', 
        ContactConfirmResource()),
    (r'^contacts/documents/$', 
        ContactDocumentResource()),
    (r'^contacts/(?P<slug>[0-9A-Za-z-]+)/$', 
        ContactResource()),
    (r'^contact/$', 
        DirectTemplateResource("core/contact/contact.html")),
    (r'^contact/content/$', 
        DirectTemplateResource("core/contact/contact_content.html")),
)

