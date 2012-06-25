import sys
import pytz
import time

from nose.tools import assert_equals, assert_in

from lettuce import step, world, before
from tornado.httpclient import HTTPError

sys.path.append("../../../")

from newebe.lib.slugify import slugify

from newebe.contacts.models import Contact, ContactManager
from newebe.activities.models import ActivityManager
from newebe.settings import TORNADO_PORT

from newebe.contacts.models import STATE_WAIT_APPROVAL, STATE_TRUSTED
from newebe.contacts.models import STATE_PENDING, STATE_ERROR

from newebe.lib.test_util import NewebeClient, db, db2, reset_documents
from newebe.lib import date_util


ROOT_URL = u"https://localhost:%d/" % TORNADO_PORT
SECOND_NEWEBE_ROOT_URL = u"https://localhost:%d/" % (TORNADO_PORT + 10)


@before.all
def set_browers():

    reset_documents(Contact, ContactManager.getContacts)
    reset_documents(Contact, ContactManager.getContacts, db2)

    world.browser = NewebeClient()
    world.browser.set_default_user()
    world.browser.login("password")

    try: 
        world.browser2 = NewebeClient()
        world.browser2.set_default_user_2(SECOND_NEWEBE_ROOT_URL)
        world.user2 = world.browser2.user
        world.browser2.login("password")

    except HTTPError:
        print "[WARNING] Second newebe instance does not look started"


@step(u'Clear contacts')
def clear_contacts(step):
    reset_documents(Contact, ContactManager.getContacts)
    reset_documents(Contact, ContactManager.getContacts, db2)

@step(u'Convert default user to contact')
def convert_default_user_to_contact(step):
    world.contact = world.user.asContact()

@step(u'Check that contact has same properties as default user')
def check_that_contact_has_same_properties_as_default_user(step):
    assert world.user.url == world.contact.url
    assert world.user.key == world.contact.key
    assert world.user.name == world.contact.name
    assert world.user.description == world.contact.description

@step(u'Deletes contacts')
def deletes_contacts(step):
    reset_documents(Contact, ContactManager.getContacts)
    reset_documents(Contact, ContactManager.getContacts, db2)

@step(u'Creates contacts')
def creates_contacts(step):
    contact = Contact()
    contact.url = "http://localhost/1/"
    contact.slug = slugify(contact.url)
    contact.state = STATE_PENDING
    contact.key = "key1"
    contact.save()
    contact2 = Contact()
    contact2.url = "http://localhost/2/"
    contact2.slug = slugify(contact2.url)
    contact2.state = STATE_TRUSTED
    contact2.key = "key2"
    contact2.save()
    contact3 = Contact()
    contact3.url = "http://localhost/3/"
    contact3.slug = slugify(contact3.url)
    contact3.state = STATE_WAIT_APPROVAL
    contact.key = "key3"
    contact3.save()

@step(u'Get contacts')
def get_contacts(step):
    world.contacts = ContactManager.getContacts()

@step(u'Check that there is (\d+) contacts')
def check_that_there_is_x_contacts(step, nb_contacts):
    assert int(nb_contacts) == len(world.contacts)

@step(u'Get requested contacts')
def get_requested_contacts(step):
    world.contacts = ContactManager.getRequestedContacts()

@step(u'Get pending contacts')
def get_pending_contacts(step):
    world.contacts = ContactManager.getPendingContacts()
    
@step(u'Get trusted contacts')
def get_trusted_contacts(step):
    world.contacts = ContactManager.getTrustedContacts()

@step(u'Get contact with slug : ([0-9a-z-]+)')
def get_contact_with_slug(step, slug):
    world.contact = ContactManager.getContact(slug)
    
@step(u'Check contact is null')
def check_contact_is_null(step):
    assert world.contact is None

@step(u'Check contact is not null')
def check_contact_is_not_null(step):
    assert world.contact is not None

@step(u'Get trusted contact with key : ([0-9a-z-]+)')
def get_trusted_contact_with_key(step, key):
    world.contact = ContactManager.getTrustedContact(key)

@step(u'I create one contact with tag "([^"]*)"')
def i_create_one_contact_with_tag_group1(step, tag):
    contact = Contact(
        url = "http://localhost/1/",
        slug = slugify(unicode("http://localhost/1/")),
        state = STATE_PENDING,
        key = "key1",
        tags = ["all", tag]
    )
    contact.save()


@step(u'When I retrieve all tags')
def when_i_retrieve_all_tags(step):
    world.tags = ContactManager.getTags()

@step(u'I got a list with "([^"]*)", "([^"]*)" and "([^"]*)" inside it')
def i_got_a_list_with_group1_group2_and_group3_inside_it(step, tag1, tag2, tag3):
    assert_equals(len(world.tags), 4)
    assert_in(tag1, world.tags)
    assert_in(tag2, world.tags)
    assert_in(tag3, world.tags)
    


## Handlers

@step(u'Through handler retrieve requested contacts')
def through_handler_retrieve_requested_contacts(step):
    world.contacts = world.browser.fetch_documents("contacts/requested/")

@step(u'Through handlers retrieve pending contacts')
def through_handlers_retrieve_pending_contacts(step):
    world.contacts = world.browser.fetch_documents("contacts/pending/")

@step(u'Through handlers retrieve trusted contacts')
def through_handlers_retrieve_trusted_contacts(step):
    world.contacts = world.browser.fetch_documents("contacts/trusted/")

@step(u'Through handlers retrieve all contacts')
def through_handlers_retrieve_all_contacts(step):
    world.contacts = world.browser.fetch_documents("contacts/all/")

@step(u'Create a default contact')
def create_a_default_contact(step):
    contact = Contact()
    contact.url = u"http://default:8000/"
    contact.slug = slugify(contact.url)
    contact.state = STATE_TRUSTED
    contact.description = "desc 1"
    contact.name = "default contact 1"
    contact.save()

@step(u'Change default contact data through handlers')
def change_default_contact_data_through_handlers(step):
    contact = ContactManager.getContact(slugify(u"http://default:8000/"))
    contact.description = "desc 2"
    contact.url = u"http://default:8010/"
    contact.name = "default contact 2"
    world.browser.put("contacts/update-profile/", contact.toJson())
    
@step(u'Checks that default contact data are updated')
def checks_that_default_contact_data_are_updated(step):
    contact = ContactManager.getContact(slugify(u"http://default:8000/"))
    assert "http://default:8010/" == contact.url
    assert "default contact 2" == contact.name
    assert "desc 2" == contact.description

@step(u'Checks that contact update activity is properly created')
def checks_that_contact_update_activity_is_properly_created(step):
    activity = ActivityManager.get_all().first()
    assert "modifies" == activity.verb
    assert "profile" == activity.docType
    assert False == activity.isMine
    assert "default contact 2"  == activity.author

@step(u'Through handler retrieve contact with slug ([0-9a-z-]+)')
def through_handler_retrieve_contact_with_slug(step, slug):
    try:
        contact = world.browser.fetch_document("contacts/" + slug + "/")
        world.contacts = [contact]
    except HTTPError:
        world.contacts = []

@step(u'Through handler delete contact with slug ([0-9a-z-]+)')
def through_handler_delete_contact_with_slug_http_localhost_1(step, slug):
    world.contacts = []
    world.browser.delete("contacts/" + slug + "/")
    

## Adding contact

@step(u'Deletes seconde newebe contacts')
def deletes_seconde_newebe_contacts(step):
    contacts = world.browser2.fetch_documents("contacts/requested/")
    for contact in contacts:
        world.browser2.delete("contacts/" + contact["slug"] + "/")

@step(u'On first newebe add second newebe as a contact')
def on_first_newebe_add_second_newebe_as_a_contact(step):
    world.browser.post("contacts/all/",
                       body='{"url":"%s"}' % world.browser2.root_url)
    time.sleep(0.3)

@step(u'Check that first contact status is pending')
def check_that_first_contact_status_is_pending(step):
    assert 1 == len(world.contacts)
    assert STATE_PENDING == world.contacts[0]["state"]

@step(u'From second newebe retrieve all contacts')
def from_second_newebe_retrieve_all_contacts(step):
    time.sleep(0.3)
    world.contacts = world.browser2.fetch_documents("contacts/all/")

@step(u'Check that first contact status is waiting for approval')
def check_that_first_contact_status_is_waiting_for_approval(step):
    assert 1 == len(world.contacts)
    assert STATE_WAIT_APPROVAL == world.contacts[0]["state"]

@step(u'On second newebe confirm first newebe request')
def on_seconde_newebe_confirm_first_newebe_request(step):
    world.browser2.put("contacts/%s/" % slugify(ROOT_URL), "")

@step(u'Check that first contact status is trusted')
def check_that_first_contact_status_is_trusted(step):
    assert 1 == len(world.contacts)
    assert STATE_TRUSTED == world.contacts[0]["state"]

# Retry 

@step(u'Set first contact state as error')
def set_first_contact_state_as_error(step):
    contact = ContactManager.getContacts().first()
    contact.state = STATE_ERROR
    contact.save()

@step(u'Send a retry request for this contact')
def send_a_retry_request_for_this_contact(step):
    world.browser.post("contacts/%s/retry/" % slugify(SECOND_NEWEBE_ROOT_URL), "")
    time.sleep(0.3)

# Timezone

@step(u'Check that request date is set to ([a-zA-Z//]+) timezone')
def check_that_request_date_is_set_to_europe_paris_timezone(step, timezone):
    Contact._db = db2
    contact = ContactManager.getRequestedContacts().first()
    Contact._db = db

    date = date_util.get_date_from_db_date(world.contacts[0]["requestDate"])
    tz = pytz.timezone(timezone)
    date = date.replace(tzinfo=tz)
    assert date_util.convert_utc_date_to_timezone(contact.requestDate, tz) == \
                date
    
# Tags

@step(u'When I retrieve through handler all tags')
def when_i_retrieve_through_handler_all_tags(step):
    world.tags = world.browser.fetch_documents("contacts/tags/")

