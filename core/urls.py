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
    (r'^contact/tutorial/1/$', 
        DirectTemplateResource("core/contact/tutorial_1.html")),
    (r'^contact/tutorial/2/$', 
        DirectTemplateResource("core/contact/tutorial_2.html")),
)

