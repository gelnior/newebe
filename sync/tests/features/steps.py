import sys
import time

from lettuce import step, world, before
from tornado.httpclient import HTTPClient
from tornado.escape import json_decode

sys.path.append("../../../")

from newebe.lib.test_util import fetch_documents_from_url

from newebe.core.models import User, Contact, UserManager, ContactManager
from newebe.settings import TORNADO_PORT

from newebe.core.models import STATE_WAIT_APPROVAL, STATE_TRUSTED


from newebe.settings import TORNADO_PORT

ROOT_URL = "http://localhost:%d/" % TORNADO_PORT
SECOND_NEWEBE_ROOT_URL = "http://localhost:%d/" % (TORNADO_PORT + 10)

client = HTTPClient()

def delete_all_contacts_from_url(url):
    contacts = fetch_documents_from_url(url + "contacts/")
    for contact in contacts:
         world.browser.fetch(url + "contacts/" + contact.get("_id","") + "/", method="DELETE")

@before.all
def set_browser():
    world.browser = HTTPClient()

@before.each_scenario
def delete_all_contacts(scenario):
    delete_all_contacts_from_url(ROOT_URL)
    delete_all_contacts_from_url(SECOND_NEWEBE_ROOT_URL)



@step(u'Creates 5 posts on first newebe')
def creates_5_posts_on_first_newebe(step):
    assert False, 'This step must be implemented'
@step(u'Set trusted contacts on both newebe')
def set_trusted_contacts_on_both_newebe(step):
    assert False, 'This step must be implemented'
@step(u'Check that 5 posts from first newebe are stored in second newebe')
def check_that_5_posts_from_first_newebe_are_stored_in_second_newebe(step):
    assert False, 'This step must be implemented'
@step(u'Modify first newebe profile directly to DB')
def modify_first_newebe_profile_directly_to_db(step):
    assert False, 'This step must be implemented'
@step(u'When I Ask for synchronization')
def when_i_ask_for_synchronization(step):
    assert False, 'This step must be implemented'
@step(u'Check that profile saved on second newebe is the one set on first one')
def check_that_profile_saved_on_second_newebe_is_the_one_set_on_first_one(step):
    assert False, 'This step must be implemented'














