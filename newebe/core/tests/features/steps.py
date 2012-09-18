import sys
import hashlib
import logging
import pytz

# -*- coding: utf-8 -*-
from lettuce import step, world, before

from tornado.escape import json_decode

sys.path.append("../")

from newebe.apps.profile.models import UserManager, User
from newebe.lib.test_util import NewebeClient, ROOT_URL
from newebe.lib import date_util
from tornado.httpclient import HTTPError


## Before running this test suite, fake server should be started.
##

logger = logging.getLogger(__name__)

@before.all
def set_browser():
    world.browser = NewebeClient()
    world.browser.root_url="http://localhost:8888/"
    

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

@step(u'Checks that tag list initialized')
def checks_that_tag_list_initialized(step):
    assert world.user.tags == ["all"]


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


# Handlers

@step(u'When I send a request to Json resource')
def when_i_send_a_request_to_json_service(step):
    try:
        world.response = world.browser.get("json/")
    except HTTPError:
        logger.warn("Warning, fake server does not look started.")

@step(u'Then I got a response with JSON inside')
def then_i_got_a_response_with_json_inside(step):
    try:
        json_decode(world.response.body)
        assert world.response.headers["Content-type"] == 'application/json' 
    except:
        assert False, 'JSON parsing failed'

    world.response = world.browser.get("document/")

@step(u'When I send a request to document resource')
def when_i_send_a_request_to_document_resource(step):
    world.response = world.browser.fetch_document("document/")

@step(u'Then I got the user in response')
def then_i_got_the_user_in_response(step):
    assert world.response["rows"][0].get("name", None) is not None

@step(u'When I send a request to documents resource')
def when_i_send_a_request_to_documents_resource(step):
    world.response = world.browser.fetch_documents("documents/")

@step(u'Then I got two times the user in response')
def then_i_got_two_times_the_user_in_response(step):
    assert 2 == len(world.response)
    assert world.response[0].get("name", None) is not None
    assert world.response[1].get("name", None) is not None

@step(u'When I send a request to success resource')
def when_i_send_a_request_to_success_resource(step):
    world.response = world.browser.get("success/")
 
@step(u'Then I got a json with a success text')
def then_i_got_a_json_with_a_success_text(step):
    assert json_decode(world.response.body).get("success", None) is not None 

@step(u'When I send a request to failure resource')
def when_i_send_a_request_to_failure_resource(step):
    try:
        world.response = world.browser.get("failure/")
        assert False, "No error returned"
    except HTTPError, e:
        world.response = e.response

@step(u'Then I got a json with a failure text')
def then_i_got_a_json_with_a_failure_text(step):
    assert json_decode(world.response.body).get("error", None) is not None 


# Timezone
@step(u'Then dict date field is the timezone date')
def then_dict_date_field_is_the_timezone_date(step):
    date = world.user.toDict().get("date")
    date = date_util.get_date_from_db_date(date)
    date = date_util.convert_timezone_date_to_utc(date)

    assert world.user.date.replace(tzinfo=pytz.utc) == date

