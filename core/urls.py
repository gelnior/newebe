from django.conf.urls.defaults import patterns

from newebe.core.views import UserResource, ContactResource, \
                                  ContactsResource, ContactPushResource, \
                                  ContactConfirmResource, \
                                  ContactDocumentResource

from newebe.lib.resource import DirectTemplateResource

# URL configuration
urlpatterns = patterns('',

    (r'^contacts/$', 
        ContactsResource()),
    (r'^contacts/pending/$', 
        ContactsResource("pending")),
    (r'^contacts/requested/$', 
        ContactsResource("requested")),
)

