import sys
import hashlib
import datetime

from lettuce import step, world
from tornado.escape import json_decode

sys.path.append("../../../")

from newebe.profile.models import User, UserManager
from newebe.settings import TORNADO_PORT
from newebe.lib.test_util import NewebeClient


ROOT_URL = "http://localhost:%d/" % TORNADO_PORT
SECOND_NEWEBE_ROOT_URL = "http://localhost:%d/" % (TORNADO_PORT + 10)


@step(u'Send login request with password as password')
def send_login_request_with_password_as_password(step):   
    client = NewebeClient()
    client.root_url = ROOT_URL
    client.login("password")

@step('Set default user')
def set_default_user(step):
    world.user = User(
        name = "John Doe",
        password = hashlib.sha224("password").hexdigest(),
        key = "key",
        authorKey = "authorKey",
        url = "url",
        description = "my description",
        date = datetime.datetime(2011, 6, 19, 2, 20, 53)
    )
    world.user._id = "userid"

@step(u'Convert user to dict')
def convert_user_to_dict(step):
    world.dict_user = world.user.toDict()

@step(u'Check that dict conversion is correct')
def check_that_dict_conversion_is_correct(step):
    assert world.user.name == world.dict_user["name"]
    assert world.user.password == world.dict_user["password"]
    assert world.user.key == world.dict_user["key"]
    assert world.user.authorKey == world.dict_user["authorKey"]
    assert world.user.url == world.dict_user["url"]
    assert world.user.description == world.dict_user["description"]
    assert "_rev" not in world.dict_user

@step('Convert user to json')
def convert_user_to_json(step):
    world.json_user = world.user.toJson()

@step(u'Check that JSON conversion is correct')
def check_that_json_conversion_is_correct(step):
    user = json_decode(world.json_user)

    assert world.user.name == user["name"]
    assert world.user.password == user["password"]
    assert world.user.key == user["key"]
    assert world.user.authorKey == user["authorKey"]
    assert world.user.url == user["url"]
    assert world.user.description == user["description"]
    assert "_rev" not in user


@step(u'Delete current user')
def delete_current_user(step):        
    user = UserManager.getUser()
    while user:
        user.delete()
        user = UserManager.getUser()

@step(u'Save default user')
def save_default_user(step):
    world.user.key = None
    world.user.save()

@step(u'Get current user')
def get_current_user(step):        
    world.current_user = UserManager.getUser()

@step(u'Check that current user is the same as saved user')
def check_that_current_user_is_the_same_as_saved_user(step):
    assert world.current_user.key == world.user.key

@step(u'Check that user key is properly set')
def check_that_key_is_properly_set(step):
    assert world.user._id == world.user.key

@step(u'Convert default user to contact')
def convert_default_user_to_contact(step):
    world.contact = world.user.asContact()

@step(u'Check that contact has same properties as default user')
def check_that_contact_has_same_properties_as_default_user(step):
    assert world.user.url == world.contact.url
    assert world.user.key == world.contact.key
    assert world.user.name == world.contact.name
    assert world.user.description == world.contact.description


