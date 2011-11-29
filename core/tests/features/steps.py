import sys
import hashlib

# -*- coding: utf-8 -*-
from lettuce import step, world

from tornado.httpclient import HTTPRequest
from tornado.escape import json_decode

sys.path.append("../../../")

from newebe.settings import TORNADO_PORT
from newebe.profile.models import UserManager, User

ROOT_URL = "http://localhost:%d/" % TORNADO_PORT
SECOND_NEWEBE_ROOT_URL = "http://localhost:%d/" % (TORNADO_PORT + 10)


@step(u'Deletes current user')
def delete_current_user(step):
    user = UserManager.getUser()
    user.delete

@step(u'Sets a new user')
def set_a_new_user(step):
    world.user = User(
        name = "John Doe",
        password = hashlib.sha224("password").hexdigest(),
        key = None,
        authorKey = "authorKey",
        url = ROOT_URL,
        description = "my description"
    )

@step(u'Saves it')
def save_it(step):
    world.user.save()

@step(u'Checks that is date is set')
def checks_that_is_date_is_set(step):
    assert world.user.date is not None

@step(u'Gets Default User')
def get_default_user(step):
    world.user = UserManager.getUser()

@step(u'Converts it to dict')
def convert_it_to_dict(step):
    dic = world.user.toDict()
    assert dic.__contains__("name")
    assert dic.__contains__("password")
    assert not dic.__contains__("_rev")

@step(u'Converts it to JSON')
def convert_it_to_json(step):
    dic = json_decode(world.user.toJson())
    assert dic.__contains__("name")
    assert dic.__contains__("password")

