import sys
import os
import datetime 

from lettuce import step, world

sys.path.append("../../../")
os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'

from newebe.activities.models import Activity, ActivityManager
from newebe.core.models import Contact




@step('Take the default activity')
def get_default_activity(step):

    if not hasattr(world, "activity"):
        world.activity = Activity(
            author = "me",
            docId = "aaavvvbbbb",
            verb = "write",
            method = "POST",
            isMine = False,
            errors = [],
            date = datetime.datetime(2010, 9, 01, 11, 05, 12)
        )


@step('Take the default contact')
def get_default_contact(step):

    if not hasattr(world, "contact"):
        world.contact = Contact(
            name = "My contact",
            key = "contact_key",
            url = "contact_url",
            state = "TRUSTED",
            slug = "contact_url"
        )

@step('Add an error for this contact to the activity')
def add_error_to_contact(step):

    world.activity.add_error(world.contact)

@step(u'Assert that activity error infos are the same as contact info.')
def assert_that_activity_error_infos_are_the_same_as_contact_info(step):

    assert world.activity.errors
    
    error = world.activity.errors[0]

    assert error["contactKey"] == world.contact.key
    assert error["contactName"] == world.contact.name
    assert error["contactUrl"] == world.contact.url


